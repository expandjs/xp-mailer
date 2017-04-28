/**
 * @license
 * Copyright (c) 2017 The expand.js authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */

// Const
const nodemailer = require('nodemailer'),
    XP           = require('expandjs');

/*********************************************************************/

/**
 * A class used to provide fs mailing functionality.
 *
 * @class XPMailer
 * @since 1.0.0
 * @description A class used to provide fs mailing functionality
 * @keywords nodejs, expandjs
 * @source https://github.com/expandjs/xp-mailer/blob/master/lib/index.js
 */
module.exports = global.XPMailer = new XP.Class('XPMailer', {

    /**
     * @constructs
     * @param {Object} options The mailer options
     *   @param {Object} options.auth The authentication data
     *   @param {string} [options.hostname = "localhost"] The hostname or IP address to connect to
     *   @param {string} [options.name] The optional hostname of the client
     *   @param {number} [options.port] The port to connect to
     *   @param {Object} [options.tls] Additional [TLSSocket options](https://nodejs.org/api/tls.html#tls_class_tls_tlssocket) to be passed to the socket constructor
     *   @param {boolean} [options.secure = false] If set to true, the connection will use TLS when connecting to server, otherwise TLS is used if server supports STARTTLS extension
     */
    initialize(options) {

        // Setting
        this.options   = options;
        this.auth      = this.options.auth;
        this.hostname  = this.options.hostname || 'localhost';
        this.name      = this.options.name || null;
        this.port      = this.options.port || null;
        this.tls       = this.options.tls || {};
        this.secure    = this.options.secure || false;

        // Adapting
        this.transporter = nodemailer.createTransport({
            auth: this.auth,
            host: this.hostname,
            name: this.name,
            port: this.port,
            secure: this.secure,
            tls: this.tls
        });
    },

    /*********************************************************************/

    /**
     * Sends an email accordingly to the specified options.
     * The `callback` is invoked with 2 arguments: (`error`, `result`).
     *
     * A 2nd parameter can be provided to specify a list of `attachments`.
     *
     * @method send
     * @param {Object} mail
     *   @param {string} mail.from
     *   @param {string} mail.to
     *   @param {string} [mail.cc]
     *   @param {string} [mail.bcc]
     *   @param {string} [mail.html]
     *   @param {string} [mail.text]
     * @param {Array} [attachments]
     *   @param {string | Buffer | Stream} attachments.content
     *   @param {string} attachments.filename
     *   @param {string} [attachments.href]
     * @param {Function} [callback]
     */
    send: {
        callback: true,
        value(mail, attachments, callback) {

            // Asserting
            if (!XP.isObject(mail)) { callback(XP.error(500, '"email" must be Object.')); return; }
            if (!XP.isString(mail.from, true)) { callback(XP.error(500, '"email.from" must be string.')); return; }
            if (!XP.isString(mail.to, true)) { callback(XP.error(500, '"email.to" must be string.')); return; }
            if (!XP.isVoid(mail.cc) && !XP.isString(mail.cc)) { callback(XP.error(500, '"email.cc" must be string.')); return; }
            if (!XP.isVoid(mail.bcc) && !XP.isString(mail.bcc)) { callback(XP.error(500, '"email.cc" must be string.')); return; }
            if (!XP.isVoid(mail.html) && !XP.isString(mail.html)) { callback(XP.error(500, '"email.html" must be string.')); return; }
            if (!XP.isVoid(mail.text) && !XP.isString(mail.text)) { callback(XP.error(500, '"email.text" must be string.')); return; }
            if (!XP.isVoid(attachments) && !XP.isArray(attachments)) { callback(XP.error(500, '"attachments" must be Array.')); return; }

            // Sending
            this.transporter.sendMail(Object.assign({}, mail, {attachments: attachments}), callback);
        }
    },

    /*********************************************************************/

    /**
     * The authentication data.
     *
     * @property auth
     * @type Object
     */
    auth: {
        set(val) { return this.auth || val; },
        validate(val) { return !XP.isObject(val) && 'Object'; }
    },

    /**
     * The hostname or IP address to connect to.
     *
     * @property hostname
     * @type string
     * @default "localhost"
     */
    hostname: {
        set(val) { return this.hostname || val; },
        validate(val) { return !XP.isString(val) && 'string'; }
    },

    /**
     * The optional hostname of the client
     *
     * @property name
     * @type string
     */
    name: {
        set(val) { return XP.isDefined(this.name) ? this.name : val; },
        validate(val) { return !XP.isVoid(val) && !XP.isString(val) && 'string'; }
    },

    /**
     * The port to connect to.
     *
     * @property port
     * @type number
     */
    port: {
        set(val) { return XP.isDefined(this.port) ? this.port : val; },
        validate(val) { return !XP.isVoid(val) && !XP.isInt(val, true) && 'number'; }
    },

    /**
     * If set to true, the connection will use TLS when connecting to server, otherwise TLS is used if server supports STARTTLS extension
     *
     * @property secure
     * @type boolean
     * @default false
     */
    secure: {
        set(val) { return XP.isDefined(this.secure) ? this.secure : !!val; }
    },

    /**
     * Additional [TLSSocket options](https://nodejs.org/api/tls.html#tls_class_tls_tlssocket) to be passed to the socket constructor.
     *
     * @property tls
     * @type Object
     */
    tls: {
        set(val) { return this.tls || val; },
        validate(val) { return !XP.isVoid(val) && !XP.isObject(val) && 'Object'; }
    },

    /**
     * The adapted transporter.
     *
     * @property transporter
     * @type Object
     * @readonly
     */
    transporter: {
        set(val) { return this.transporter || val; },
        validate(val) { return !XP.isObject(val) && 'Object'; }
    }
});
