module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  var jsFiles = grunt.file.expand(["code/assets/js/**/*.js", "!code/assets/js/*.built.js", "!code/assets/js/build.js", "!code/assets/js/vendor/*"]),
      sassFiles = grunt.file.expand(["code/assets/sass/*"]),
      htmlFiles = grunt.file.expand(["code/*.html", "code/*.tpl"]);

  grunt.initConfig({

    copy: {
      main: {
        files: [ {
          expand: true,
          cwd: "code/",
          src: ["**", "!js/**", "!**/*.md", "!**/*.scss"],
          dest: "server/public/"
        }, {
          expand: true,
          cwd: "bower_components/bootstrap-sass-official/assets/stylesheets/",
          src: ["**/*.scss"],
          dest: "code/assets/sass/vendor"
        } ]
      }
    },

    clean: ["build/*", "server/public/*"],

    bower_concat: {
      all: {
        dest: "code/assets/js/vendor/vendor.js",
        dependencies: {
          "underscore": "jquery",
          "backbone": ["jquery", "underscore"],
          "marionette": ["jquery", "underscore", "backbone"]
        }
      }
    },

    bowercopy: {
      dist: {
        options: {
          destPrefix: "code/assets/js/vendor"
        },
        files: {
          "require.js": "requirejs/require.js",
          "jquery.js": "jquery/dist/jquery.js",
          "jquery-ui.js": "jqueryui/jquery-ui.js",
          "underscore.js": "underscore/underscore.js",
          "underscore-tpl.js": "requirejs-underscore-tpl/underscore-tpl.js",
          "json2.js": "json2/json2.js",
          "backbone.js": "backbone/backbone.js",
          "backbone.obscura.js": "backbone.obscura/backbone.obscura.js",
          "backbone.localStorage.js": "Backbone.localStorage/backbone.localStorage.js",
          "backbone.marionette.js": "marionette/lib/backbone.marionette.js",
          "bootstrap.js": "bootstrap-sass-official/assets/javascripts/bootstrap.js",
          "spin.js": "spin.js/spin.js",
          "text.js": "text/text.js",
          "backbone.syphon.js": "marionette.backbone.syphon/lib/backbone.syphon.js",
          "almond.js": "almond/almond.js"
        }
      },
      sass: {
        options: { destPrefix: "code/assets/sass/vendor/" },
        files: { "bootstrap": "bootstrap-sass-official/assets/stylesheets/*" }
      },
      fonts: {
        options: { destPrefix: "code/assets/fonts/vendor/" },
        files: { "bootstrap": "bootstrap-sass-official/assets/fonts/bootstrap/*" }
      }
    },

    jshint: {
      all: jsFiles,
      options: {
        jshintrc: true
      }
    },

    lintspaces: {
      all: {
        src: [jsFiles, "!*.min.js"],
        options: {
          editorconfig: ".editorconfig",
          ignores: ["js-comments"]
        }
      }
    },

    express: {
      all: {
        options: {
          server: "./server/server.js"
        }
      },
      watchdev: {
        options: {
          server: "./server/server.js",
          serverreload: true
        }
      }
    },

    watch: {
      code: {
        files: ["code/assets/js/**/*.js", "!code/assets/js/vendor/*", "code/*.tpl", htmlFiles],
        tasks: ["dev"],
        options: {
          livereload: true
        }
      },
      sass: {
        files: [sassFiles],
        tasks: ["sass", "dev"],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      dist: {
        files: {
          "code/assets/css/main.css": "code/assets/sass/main.scss"
        }
      }
    }
  });

  grunt.registerTask("init", ["bowercopy"]);
  grunt.registerTask("lint", ["jshint", "lintspaces"]);
  grunt.registerTask("watch-dev", ["express:all", "watch"]);
  grunt.registerTask("dev", ["jshint", "lintspaces", "clean", "copy"]);
  grunt.registerTask("ex-watch", ["express:watchdev", "express-keepalive"]);
};
