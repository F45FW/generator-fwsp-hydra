const generators = require('yeoman-generator');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');
const spawn = require('child_process').spawn;
const version = require('./../package.json').version;
const chalk = require('chalk');

const HYDRA_NPM_MODULES = [
  'hydra',
  'hydra-express',
  'fwsp-config',
  'fwsp-jwt-auth',
  'fwsp-jsutils',
  'fwsp-logger',
  'fwsp-server-response'
];
const SCAFFOLD_FOLDERS = ['config', 'specs', 'specs/helpers', 'scripts'];
const COPY_FILES = ['specs/test.js', 'specs/helpers/chai.js'];
const DOT_FILES = ['.editorconfig', '.eslintrc', '.gitattributes', '.nvmrc'];
const USER_PROMPTS = [
  {
    type: 'input',
    name: 'name',
    message: 'Name of the service (`-service` will be appended automatically)'
  },
  {
    type: 'input',
    name: 'author',
    message: 'Your full name?'
  },
  {
    type: 'input',
    name: 'email',
    message: 'Your email address?'
  },
  {
    type: 'input',
    name: 'organization',
    message: 'Your organization or username? (used to tag docker images)'
  },
  {
    type: 'input',
    name: 'ip',
    message: 'Host the service runs on?',
    default: ''
  },
  {
    type: 'input',
    name: 'port',
    message: 'Port the service runs on?',
    default: 0
  },
  {
    type: 'input',
    name: 'purpose',
    message: 'What does this service do?'
  },
  {
    type: 'confirm',
    name: 'auth',
    message: 'Does this service need auth?',
    default: false
  },
  {
    type: 'confirm',
    name: 'express',
    message: 'Is this a hydra-express service?',
    default: true
  },
  {
    when: response => response.express,
    type: 'confirm',
    name: 'views',
    message: 'Set up a view engine?',
    default: false
  },
  {
    type: 'confirm',
    name: 'logging',
    message: 'Set up logging?',
    default: false
  },
  {
    when: response => response.express,
    type: 'confirm',
    name: 'cors',
    message: 'Enable CORS on serverResponses?',
    default: false
  },
  {
    type: 'confirm',
    name: 'npm',
    message: 'Run npm install?',
    default: false
  },
];

let checkLatestVersion = (module) => {
  let npmCommand = require('os').platform() === 'win32' ? 'npm.cmd' : 'npm';
  return new Promise((resolve, reject) => {
    let npmShow = spawn(npmCommand, ['show', module, 'version']);
    npmShow.on('error', (err) => {
      reject(err);
    });
    npmShow.stdout.on('data', (data) => {
      resolve(data.toString().trim());
    });
    npmShow.stderr.on('data', (data) => {
      reject(data);
    });
  });
};

module.exports = generators.Base.extend({

  initializing: {
    displayVersion: function () {
      return Promise.all(['yeoman-generator', 'yo'].map(module => checkLatestVersion(module)))
        .then(versions => {
          console.log(
            chalk.yellow(`fwsp-hydra generator v${chalk.bold.underline(version)}`) + '   ' +
            chalk.cyan(`yeoman-generator v${chalk.bold.underline(versions[0])}`) + '   ' +
            chalk.green(`yo v${chalk.bold.underline(versions[1])}`)
          );
        })
        .catch(err => console.log(err.toString()));
    },
    latestModuleVersion: function () {
      return Promise.all(HYDRA_NPM_MODULES.map(module => checkLatestVersion(module)))
        .then(results => {
          this.moduleVersions = {};
          HYDRA_NPM_MODULES.forEach((val, i) => {
            this.moduleVersions[val] = results[i];
          });
        });
    },
  },

  prompting: function () {
    return this.prompt(USER_PROMPTS).then(function (answers) {
      this.appname = answers.name;
      this.author = answers.author;
      this.email = answers.email;
      this.organization = answers.organization;
      this.serviceFolder = answers.name + '-service';
      this.port = answers.port;
      this.purpose = answers.purpose;
      this.auth = answers.auth;
      this.express = answers.express;
      this.views = this.express ? answers.views : false;
      this.logging = answers.logging;
      this.cors = this.express ? answers.cors : false;
      this.npm = answers.npm;
    }.bind(this));
  },

  scaffoldFolders: function () {
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

  copyFiles: function () {
    if (this.auth) {
      COPY_FILES.push('config/service.pub');
    }
    COPY_FILES.forEach((file) => {
      this.copy(file, this.serviceFolder + '/' + file);
    });
    DOT_FILES.forEach((file) => {
      this.copy(file.replace('.', 'dot_'), this.serviceFolder + '/' + file);
    });
  },

  copyTemplates: function () {

    let deps = ['fwsp-config'];
    if (this.express) {
      deps.push('hydra-express', 'fwsp-server-response');
    } else {
      deps.push('hydra');
    }
    if (this.auth) {
      deps.push('fwsp-jwt-auth');
    }
    if (this.logging) {
      deps.push('fwsp-logger');
      if (!this.express) {
        deps.push('fwsp-jsutils');
      }
    }

    var params = {
      name: this.appname,
      Name: this.appname.charAt(0).toUpperCase() + this.appname.slice(1),
      author: this.author,
      email: this.email,
      organization: this.organization,
      ip: this.ip,
      port: this.port,
      purpose: this.purpose,
      auth: this.auth,
      express: this.express,
      views: this.views,
      logging: this.logging,
      cors: this.cors,
      npm: this.npm,
      deps: deps,
      versions: this.moduleVersions
    };
    var copy = (src, dest) => {
      if (!dest) {
        dest = src;
      }
      try {
        this.fs.copyTpl(
          this.templatePath(src),
          this.destinationPath(this.serviceFolder + '/' + dest),
          params
        );
      } catch (err) {
        console.log(`Error copying template: ${src}`, err);
      }
    };
    copy('dot_gitignore', '.gitignore');
    copy('package.json');
    copy('README.md');
    copy(this.express ? 'hydra-express-service.js' : 'hydra-service.js',
      this.appname + '-service.js');
    copy('config/sample-config.json');
    copy('config/sample-config.json', 'config/config.json');
    copy('scripts/docker.js');
    if (this.express) {
      copy('routes/v1-routes.js', 'routes/' + this.appname + '-v1-routes.js');
    }
  },

  _done: function () {
    console.log(`\nDone!\n'cd ${this.serviceFolder}' then ${this.npm ? '' : '\'npm install\' and '}'npm start'\n`)
  },

  done: function () {
    if (this.npm) {
      process.chdir(process.cwd() + '/' + this.serviceFolder);
      this.installDependencies({
        bower: false,
        npm: true,
        callback: () => this._done()
      });
    } else {
      this._writeFiles(() => this._done());
    }
  }

});
