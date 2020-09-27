'use strict';

const config = require('../config');
const emailService = require('./email-service');
const pg = require('pg');
pg.defaults.ssl = true;


module.exports = function(userId, phone_number, user_name, previous_job, years_of_experience, job_vacancy){
    console.log('sending email');
    let emailContent = 'A new job inquiry from ' + user_name + ' for the job: ' + job_vacancy +
        '.<br> Previous job position: ' + previous_job + '.' +
        '.<br> Years of experience: ' + years_of_experience + '.' +
        '.<br> Phone number: ' + phone_number + '.';

    //emailService.sendEmail('New job application', emailContent);

    var pool = new pg.Pool(config.PG_CONFIG);
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client
            .query(
                'INSERT into job_data ' +
                '(fb_Id, phone_number, user_name, previous_job, years_of_experience, job_vacancy) ' +
                'VALUES($1, $2, $3, $4, $5, $6) RETURNING fb_Id',
                [userId, phone_number, user_name, previous_job, years_of_experience, job_vacancy],
                function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('row inserted with id: ' + result.rows[0].fb_Id);
                    }

                });
    });
    pool.end();
}
