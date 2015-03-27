require 'mechanize'
require 'mongo'
require 'nokogiri'
require 'open-uri'
require 'json'
require 'slop'

base_url = "http://www.adventuretimecardwars.com"
category_urls = {
  "blue_plains" => "http://www.adventuretimecardwars.com/Category:Blue_Plains_Cards",
  "cornfield" => "http://www.adventuretimecardwars.com/Category:Cornfield_Cards",
  "nicelands" => "http://www.adventuretimecardwars.com/Category:NiceLands_Cards",
  "rainbow" => "http://www.adventuretimecardwars.com/Category:Rainbow_Cards",
  "sandylands" => "http://www.adventuretimecardwars.com/Category:SandyLands_Cards",
  "useless_swamp" => "http://www.adventuretimecardwars.com/Category:Useless_Swamp_Cards"
}

mech = Mechanize.new

def get_card_pages()
  #get the subject codes from the tt page
  category_urls.each do |category, url|
    mech.get(url) do |page|
      doc = Nokogiri::HTML(page.body)
      doc.css("#mw-pages table").css("li a").each do |link|
        mech.get(base_url + link["href"]) do |card_page|
          fPath = "data/cards/" + category + "/" + link["title"] + ".html"
          dirname = File.dirname(fPath)
          unless File.directory?(dirname)
            FileUtils.mkdir_p(dirname)
          end

          File.write(fPath, card_page.body)
          puts "Done writing: #{fPath}"
        end

      end
    end
  end
end

def parse_card_page(fPath, color)
  last_row = nil
  card = {"color" => color}
  doc = Nokogiri::HTML(File.open(fPath))
  doc.css("#mw-content-text table").css("tr").each_with_index do |row, i|
    if i == 0 then
      card["name"] = row.css("span").text
    elsif i == 1 then
      card["thumb"] = row.css("td img")[0]["src"]
      card["image"] = row.css("td img")[0]["srcset"].split(/ 1\.5x,/)[0]
      card["type"] = row.css("td")[2].css("a").text
    else
      if row.css("td > a")[0] then
        if row.css("td a")[0]["title"] == "Cost" then
          card["cost"] = row.css("td a")[1].text if !card["cost"]
        elsif row.css("td a")[0]["title"] == "ATK" then
          card["atk"] = row.css("td a")[1].text if !card["atk"]
        elsif row.css("td a")[0]["title"] == "DEF" then
          card["def"] = row.css("td a")[1].text if !card["def"]
        elsif row.css("td a")[0]["title"] == "Ability Type" then
          card["ability"] = row.css("td a")[1].text if !card["ability"]
        end
      else
        if last_row.css("th") && last_row.css("th").text == "Card Information" then
          card["text"] = row.css("span").text if !card["text"]
        end
      end
    end

    last_row = row
  end

  img_path = "data/images/" + card["image"].split("/").last
  thumb_path = "data/images/thumbs/" + card["thumb"].split("/").last

  File.open(img_path, "w") do |fo|
    fo.write open("http://www.adventuretimecardwars.com" + card["image"]).read
  end
  File.open(thumb_path, "w") do |fo|
    fo.write open("http://www.adventuretimecardwars.com" + card["thumb"]).read
  end

  card["image"] = card["image"].split("/").last
  card["thumb"] = card["thumb"].split("/").last

  return card
end

def get_cards()
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'cardwars')
  {
    "blue_plains" => "Blue Plains",
    "cornfield" => "Cornfield",
    "nicelands" => "NiceLands",
    "rainbow" => "Rainbow",
    "sandylands" => "SandyLands",
    "useless_swamp" => "Useless Swamp"
  }.each do |color, color_name|
    Dir["data/cards/" + color + "/*"].each do |fname|
      card = parse_card_page(fname, color_name)
      client[:cards].insert_one(card)
      File.open("data/json/" + card["name"] + ".json", "w") do |fo|
        fo.write(card)
      end
    end
  end
end

#parse_card_page("data/cards/blue_plains/Blue Ogre.html", "Blue Plains")
get_cards()
