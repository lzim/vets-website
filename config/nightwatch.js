/* eslint-disable camelcase, strict */
'use strict';

const electron = require('electron-prebuilt');
const chromedriver = require('chromedriver');
const seleniumServer = require('selenium-server');

require('babel-core/register');

const selenium_server_port = process.env.SELENIUM_PORT || 4444;

module.exports = {
  src_folders: ['./test'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './test/util/nightwatch-commands',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: process.env.BUILDTYPE === 'production',
  test_workers: false,
  test_settings: {
    'default': {
      launch_url: 'http://ondemand.saucelabs.com:80',
      filter: './test/**/*.e2e.spec.js',
      selenium_host: 'ondemand.saucelabs.com',
      selenium_port: 80,
      username: 'aubreyadhoc',
      access_key: '5b01dd5d-5faf-40ce-9c40-c0403fec76e7',
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: false
        // on_failure: true,
        // path: 'logs/screenshots'
      },
      globals: {
        waitForConditionTimeout: 10000
      }
    },
    local: {
      launch_url: `localhost:${process.env.WEB_PORT || 3333}`,
      filter: './test/**/*.e2e.spec.js',
      selenium_host: 'localhost',
      selenium_port: selenium_server_port,
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'logs/screenshots'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        webStorageEnabled: true,
        chromeOptions: {
          binary: electron,
          args: ['--window-size=1024,768']
        }
      },
      selenium: {
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path
        },
        start_process: true,
        server_path: seleniumServer.path,
        log_path: './logs/selenium',
        host: '127.0.0.1',
        port: selenium_server_port,
      },
      test_workers: {
        enabled: false,
        workers: parseInt(process.env.CONCURRENCY || 1, 10)
      },
    },
    chrome: { // your local Chrome browser (chromedriver)
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },
    chromemac: { // browsers used on saucelabs:
      desiredCapabilities: {
        browserName: 'chrome',
        platform: 'OS X 10.11',
        version: '47'
      }
    },
    ie11: {
      desiredCapabilities: {
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.0'
      }
    },
    firefox: {
      desiredCapabilities: {
        platform: 'XP',
        browserName: 'firefox',
        version: '33'
      }
    },
    ie10: {
      desiredCapabilities: {
        platform: 'Windows 7',
        browserName: 'internet explorer',
        version: '10'
      }
    },
    android_s4_emulator: {
      desiredCapabilities: {
        browserName: 'android',
        deviceOrientation: 'portrait',
        deviceName: 'Samsung Galaxy S4 Emulator',
        version: '4.4'
      }
    },
    iphone_6_simulator: {
      desiredCapabilities: {
        browserName: 'iPhone',
        deviceOrientation: 'portrait',
        deviceName: 'iPhone 6',
        platform: 'OSX 10.10',
        version: '8.4'
      }
    },
    accessibility: {
      filter: './test/accessibility/*.spec.js',
      globals: {
        asyncHookTimeout: 20000,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        webStorageEnabled: true,
        chromeOptions: {
          binary: electron,
          args: ['--window-size=1024,768']
        }
      },
      test_workers: {
        enabled: false,
        workers: parseInt(process.env.CONCURRENCY || 1, 10)
      }
    }
  }
};
