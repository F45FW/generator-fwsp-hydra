const generators = require('yeoman-generator'),
      mkdirp = require('mkdirp');

const SCAFFOLD_FOLDERS = ['config', 'specs', 'specs/helpers'],
      COPY_FILES = ['.eslintrc', '.gitattributes', '.gitignore', '.nvmrc', '.jscsrc',
                    'deploy-check.sh', 'specs/test.js', 'specs/helpers/chai.js'],
      USER_PROMPTS = [
        {
          type    : 'input',
          name    : 'name',
          message : 'Name of the service (`-service` will be appended automatically)'
        },
        {
          type    : 'input',
          name    : 'port',
          message : 'Port the service runs on?',
          default : 0
        },
        {
          type    : 'input',
          name    : 'purpose',
          message : 'What does this service do?'
        },
        {
          type    : 'confirm',
          name    : 'auth',
          message : 'Does this service need auth?'
        },
        {
          type    : 'confirm',
          name    : 'express',
          message : 'Is this a hydra-express service?'
        },
        {
          when    : response => response.express,
          type    : 'confirm',
          name    : 'views',
          message : 'Set up a view engine?'
        }
      ];

module.exports = generators.Base.extend({

  prompting: function () {
    return this.prompt(USER_PROMPTS).then(function (answers) {
       this.appname = answers.name;
       this.serviceFolder = answers.name + '-service';
       this.port = answers.port;
       this.purpose = answers.purpose;
       this.auth = answers.auth;
       this.express = answers.express;
       this.views = this.express ? answers.views : false;
     }.bind(this));
  },

  scaffoldFolders: function(){
    if (this.express) {
      SCAFFOLD_FOLDERS.push('routes');
      if (this.views) {
        SCAFFOLD_FOLDERS.push('views');
      }
    }
    SCAFFOLD_FOLDERS.forEach((folder) => {
      mkdirp.sync(this.serviceFolder + '/' + folder);
    });
  },

  copyFiles: function() {
    if (this.auth) {
      COPY_FILES.push('config/service.pub');
    }
    COPY_FILES.forEach((file) => {
        this.copy(file, this.serviceFolder + '/' + file);
    });
  },

  copyTemplates: function () {
    var params = {
      name: this.appname,
      Name: this.appname.charAt(0).toUpperCase() + this.appname.slice(1),
      port: this.port,
      purpose: this.purpose,
      auth: this.auth,
      express: this.express,
      views: this.views
    };
    var copy = (src, dest) => {
      if (!dest) {
        dest = src;
      }
      this.fs.copyTpl(
        this.templatePath(src),
        this.destinationPath(this.serviceFolder + '/' + dest),
        params
      );
    };
    copy('package.json');
    copy('README.md');
    copy('service.js', this.appname + '-service.js');
    copy('config/sample-config.json');
    copy('config/sample-config.json', 'config/config.json');
    if (this.express) {
      copy('routes/v1-routes.js', 'routes/' + this.appname + '-v1-routes.js');
    }
   }

});
