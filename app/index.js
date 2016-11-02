const generators = require('yeoman-generator');

const SCAFFOLD_FOLDERS = ['config', 'specs', 'specs/helpers'],
      COPY_FILES = ['.eslintrc', '.gitattributes', '.gitignore', '.nvmrc', '.jscsrc', 'config/service.pub',
                    'deploy-check.sh', 'specs/test.js', 'specs/helpers/chai.js'],
      USER_PROMPTS = [
        {
          type    : 'input',
          name    : 'name',
          message : 'Name of the service (`-service` will be appended automatically)',
          default : this.appname // Default to current folder name
        },
        {
          type    : 'input',
          name    : 'port',
          message : 'Port the service runs on?',
          default : 0
        },
        {
          type    : 'confirm',
          name    : 'express',
          message : 'Is this a hydra-express service?'
        },
        {
          type    : 'confirm',
          name    : 'views',
          message : 'Set up a view engine?'
        }
      ];

module.exports = generators.Base.extend({

  prompting: function () {
    var matches = this.appname.match(/(.+)[\- ]service$/);
    if (matches !== null) {
      this.appname = matches[1];
    }
    return this.prompt(USER_PROMPTS).then(function (answers) {
       this.appname = answers.name;
       this.express = answers.express;
       this.views = answers.views;
       this.port = answers.port;
       if (this.views && !this.express) {
         console.log('Warning: can\'t set up view engine for non-hydra-express app');
         this.views = false;
       }
     }.bind(this));
  },

  scaffoldFolders: function(){
    if (this.express) {
      SCAFFOLD_FOLDERS.push('routes');
    }
    if (this.express && this.views) {
      SCAFFOLD_FOLDERS.push('views');
    }
    SCAFFOLD_FOLDERS.forEach((folder) => {
      this.mkdir(folder);
    });
  },

  copyFiles: function() {
    COPY_FILES.forEach((file) => {
        this.copy(file, file);
    });
  },

  copyTemplates: function () {
    var params = {
      name: this.appname,
      Name: this.appname.charAt(0).toUpperCase() + this.appname.slice(1),
      port: this.port,
      views: this.views,
      express: this.express
    };
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('service.js'),
      this.destinationPath(this.appname + '-service.js'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('config/sample-config.json'),
      this.destinationPath('config/sample-config.json'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('routes/v1-routes.js'),
      this.destinationPath('routes/' + this.appname + '-v1-routes.js'),
      params
    );
   }


});
