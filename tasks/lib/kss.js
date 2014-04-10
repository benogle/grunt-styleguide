/*jshint node:true*/
/*
 * styleguide
 * https://github.com/indieisaconcept/grunt-styleguide/tasks/lib/kss
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

var kss = require('kss'),
    path = require('path'),
    base = path.dirname(require.resolve('kss')),
    wrench = require('wrench');

module.exports = {

    init: function (grunt) {

        'use strict';

        return function (styleguide, compile, done) {

            var files = styleguide.files,
                options = styleguide.options,

                // template defaults
                template = styleguide.template,
                kssTemplate = base + '/lib/template',
                defaultTemplate = path.resolve(__dirname + '../../../templates/kss'),
                missingTemplate = template.src && grunt.file.exists(defaultTemplate) ? false : !grunt.file.exists(defaultTemplate),

                args = [base + '/bin/kss-node'];

            // TEMPLATE SYNC - COPY KSS TEMPLATE TO STYLEGUIDE ROOT
            if (missingTemplate) {
                grunt.file.mkdir(defaultTemplate);
                wrench.copyDirSyncRecursive(kssTemplate, defaultTemplate);

                grunt.log.write('- Default KSS template in use ' + grunt.util.linefeed);
                grunt.log.write('- ' + defaultTemplate + grunt.util.linefeed);
                grunt.log.write('- Copy this to your project and update your gruntfile config should you wish to customise.' + grunt.util.linefeed);

            }

            options.template = (template.src.length !== 0 && template.src || defaultTemplate);

            // set preprocessor options
            if (/(style|less|stylus|sass|css)/.test(styleguide.preprocessor)) {

                if (!grunt.file.exists(files.src[0])) {
                    grunt.fail.warn('Specify an absolute path to continue');
                }

                options[styleguide.preprocessor] = files.src[0];

            }

            options.loadPath = styleguide.framework.loadPath;

            console.log(template.include);

            // Outside of the loop to make the linter happy
            function getPath(arg){
              return arg.path;
            }

            for (var k in template.include) {
              if (/(style|less|stylus|sass|css)/.test(k)) {
                options[k] = options[k] || [];
                options[k] = Array.isArray(options[k]) ? options[k] : [options[k]];
                options[k] = options[k].concat(template.include[k].map(getPath));
              }
            }

            console.log(options);

            grunt.file.mkdir(files.dest);
            compile(args.concat([files.base, files.dest]), options, done);

        };

    }

};
