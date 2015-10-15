module.exports = function(grunt) {
    grunt.initConfig({
        // CONFIGURATION --------------------------------------------------------------/
        pkg: grunt.file.readJSON('package.json'),

        project: {
            src: 'development',
            dest: 'public'
        },

        tag: {
            banner: '/*! <%= pkg.name %>, <%= pkg.author %>, Copyright <%= new Date().getFullYear() %>. */\n'
        },


        // TASKS --------------------------------------------------------------/
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= project.dest %>/css',
                    src: '**/*.css',
                    dest: '<%= project.dest %>/css'
                }]
            }
        },

        bower_concat: {
            all: {
                dest: '<%= project.dest %>/js/vendor.js',
                cssDest: '<%= project.dest %>/css/vendor.css',
                exclude: [
                    "html5shiv",  // should be loaded in the <head>
                    "compass-mixins"  // will be pulled in from variant file
                ]
            }
        },

        clean: {
            all: {
                src: ['<%= project.dest %>/css', '<%= project.dest %>/js', '<%= project.dest %>/images']
            }
        },

        concat: {
            options: {
                banner: '<%= tag.banner %>',
                process: function(src, filepath) {
                    return  '\n/*' + ' -------------------------------------------------------------\n' +
                                '   ' + filepath +
                            '\n------------------------------------------------------------- ' + '*/\n' + src;
                }
            },
            site: {
                src: ['<%= project.src %>/js/**/*.js', '!<%= project.src %>/js/noconcat/*.js'],
                dest: '<%= project.dest %>/js/site.js'
            }
        },

        copy: {
            fonts: {
                expand: true,
                src: ['<%= project.src %>/fonts/**'],
                dest: '<%= project.dest %>/css/fonts',
                filter: 'isFile',
                flatten: true
            },
            js: {
                expand: true,
                cwd: '<%= project.src %>/js/noconcat',
                src: ['**/*.js'],
                dest: '<%= project.dest %>/js'
            },
            bower: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['html5shiv/dist/html5shiv.min.js'],
                dest: '<%= project.dest %>/js'
            },
            photoswipe: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['photoswipe/dist/default-skin/default-skin.png'],
                dest: '<%= project.dest %>/css'
            }
        },

        imagemin: {
            options: {
                optimizationLevel: 4
            },
            project: {
                files: [{
                    expand: true,
                    cwd: '<%= project.src %>/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= project.dest %>/images'
                }]
            }
        },
        
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                force: true,
                globals: {
                    jQuery: true
                },
                '-W030': true // rule does not like shorthand if statements
            },
            all: {
                src: ['Gruntfile.js', '<%= project.src %>/js/**/*.js']
            }
        },

        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    sourceComments: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= project.src %>/sass',
                    src: ['**/*.scss'],
                    dest: '<%= project.dest %>/css',
                    extDot: 'last',
                    ext: '.css'
                }],
            },
            prod: {
                options: {
                    outputStyle: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= project.src %>/sass',
                    src: ['**/*.scss'],
                    dest: '<%= project.dest %>/css',
                    extDot: 'last',
                    ext: '.css'
                }],
            }
        },

        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            }
        },

        uglify: {
            options: {
                banner: '<%= tag.banner %>'
            },
            all: {
                expand: true,
                cwd: '<%= project.dest %>/js/',
                src: ['**/*.js'],
                dest: '<%= project.dest %>/js/'
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            jekyll: {
                files: ['<%= project.src %>/**'],
                tasks: ['shell:jekyllBuild']
            },
            css: {
                files: ['<%= project.src %>/sass/**'],
                tasks: ['sass:dev', 'newer:autoprefixer']
            },
            js: {
                files: ['<%= project.src %>/js/**'],
                tasks: ['newer:concat', 'newer:jshint']
            },
            images: {
                files: ['<%= project.src %>/images/**'],
                tasks: ['newer:imagemin']
            }
        }


    });

    // DEPENDENCIES --------------------------------------------------------------/
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    // SETUP --------------------------------------------------------------/
    grunt.registerTask('default', ['dev']); // Default Task

    // Development Tasks
    grunt.registerTask('dev', [
        'shell:jekyllBuild',
        'bower_concat',
        'concat',
        'newer:imagemin',
        'newer:copy',
        'sass:dev',
        'newer:autoprefixer',
        'uglify'
    ]);

    // Production Tasks
    grunt.registerTask('prod', [
        'shell:jekyllBuild',
        'bower_concat',
        'concat',
        'newer:imagemin',
        'newer:copy',
        'sass:prod',
        'newer:autoprefixer',
        'uglify'
    ]);

};