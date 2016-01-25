var Linkedin = require('node-linkedin')(),
    _ = require('lodash'),
    util = require('./util.js');

var pickInputs = {
        'id': { key: 'id', validate: { req: true } },
    },
    pickOutputs = {
        'count': 'followStatistics.count',
        'statusUpdateStatistics': 'statusUpdateStatistics',
        'engagement': {
            keyName: 'statusUpdateStatistics.viewsByMonth.values',
            fields: ['engagement']
        },
        'impressions': {
            keyName: 'statusUpdateStatistics.viewsByMonth.values',
            fields: ['impressions']
        },
        'likes': {
            keyName: 'statusUpdateStatistics.viewsByMonth.values',
            fields: ['likes']
        },
        'shares': {
            keyName: 'statusUpdateStatistics.viewsByMonth.values',
            fields: ['shares']
        }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var token = dexter.provider('linkedin').credentials('access_token'),
            linkedIn = Linkedin.init(token),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        linkedIn.companies.company_stats(inputs.id, function(err, data) {
            if (err || (data && data.errorCode !== undefined))
                this.fail(err || (data.message || 'Error Code: '.concat(data.errorCode)));
            else
                this.complete(util.pickOutputs(data, pickOutputs));

        }.bind(this));
    }
};
