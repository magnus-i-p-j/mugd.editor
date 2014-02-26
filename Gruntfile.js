module.exports = function (grunt) {

  grunt.initConfig({
      clean: [ 'build/tmp', 'build/deploy' ],
      mkdir: {
        tmp: {
          options:{
            create: [ 'build/tmp', 'build/tmp/js']
          }
        },
        deploy: {
          options:{
            create: [ 'build/deploy']
          }
        }
      },
      closureBuilder:  {
        options: {
          closureLibraryPath: 'libs/closure-library/',
          compilerFile: 'libs/closure-compiler/compiler.jar',
          output_mode: 'compile',
          compile: true,
          inputs: ['js/mugd/editor/mugd.editor.js'],
          compilerOpts: {
            debug: true,
            formatting:'PRETTY_PRINT',
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            externs:[
              "libs/externs/knockout-externs.js",
              "libs/externs/jquery-externs.js",
              "libs/externs/console-externs.js"
              ]
          },
          execOpts: {
            maxBuffer: 999999 * 1024
          }
        },
        editor: {
          src: [
            'js',
            'libs/closure-library'
          ],
          dest: 'build/tmp/js/editor.js'
        }
      },
      less: {
        all: {
          options: {
            relativeUrls: true,
            paths: ["css"],
            cleancss: true
          },
          files: {
            "build/tmp/css/all.css": "css/all.less"
          }
        }
      },
      concat: {
        tpl:{
          options:{
            process: function(src, filepath){
              var id = filepath.replace(/.*tpl\/editor\//, '').replace(/\.html/,'');
              return '<script id="' + id + '" type="text/html">\n' + src + '\n</script>'
            }
          },
          src: ['html/tpl/editor/**/*.html'],
          dest: 'build/tmp/tpl.html'
        },
        html:{
          src: ['build/header.html', 'build/tmp/tpl.html', 'build/footer.html'],
          dest: 'build/tmp/html/index.html'
        }
      },
      copy:{
        tmp:{
          cwd: 'build/tmp/',
          src:['css/*', 'html/index.html', 'js/*'],
          dest: 'build/deploy/',
          filter: 'isFile',
          expand: true
        },
        libs:{
          cwd: 'libs',
          src:['jquery-1.7.2.js', 'knockout-3.0.0.js', 'Blob.js', 'FileSaver.js'],
          dest: 'build/deploy/libs',
          filter: 'isFile',
          expand: true
        },
        data:{
          cwd: 'data/ruleset',
          src:['*.json'],
          dest: 'build/deploy/data',
          filter: 'isFile',
          expand: true
        },
        tiles:{
          src:'data/tiles/**',
          dest: 'build/deploy',
          filter: 'isFile',
          expand: true
        }
      }
    }
  );

// Load plugins here
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');


// Define your tasks here
  grunt.registerTask('default', ['clean', 'mkdir', 'closureBuilder:editor', 'less', 'concat', 'copy']);

  grunt.registerTask('test', ['closureBuilder:editor']);
};