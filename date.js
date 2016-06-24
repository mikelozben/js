/*
 *  Document   : date.js
 *  Author     : Mike Lozben [mikelozben@gmail.com]
 *  Description: Native Date extension
 */


/**
 * Returns Date of week start
 * 
 * @returns {Date} Week start Date (Monday)
 */
Date.prototype.getWeekStartDate = function() {
    var 
        tmpDate = new Date("Jan 01 2015 00:00:00"),
        fromWeekStartDaysOffset = 0,
        weekStartDate = new Date();

    tmpDate.setYear(this.getFullYear());
    tmpDate.setMonth(this.getMonth());
    tmpDate.setDate(this.getDate());

    fromWeekStartDaysOffset = ( 0 < tmpDate.getDay() ? tmpDate.getDay()-1 : 6);
    weekStartDate.setTime( tmpDate.getTime() - fromWeekStartDaysOffset*24*60*60*1000 );

    return weekStartDate;
};

/**
 * Returns Date of week end
 * 
 * @returns {Date} Week end Date (Sunday)
 */
Date.prototype.getWeekEndDate = function() {
    var 
        tmpDate = new Date("Jan 01 2015 00:00:00"),
        fromWeekStartDaysOffset = 0,
        weekEndDate = new Date();

    tmpDate.setYear(this.getFullYear());
    tmpDate.setMonth(this.getMonth());
    tmpDate.setDate(this.getDate());

    fromWeekStartDaysOffset = ( 0 < tmpDate.getDay() ? 7-tmpDate.getDay() : 0);
    weekEndDate.setTime( tmpDate.getTime() + fromWeekStartDaysOffset*24*60*60*1000 );

    return weekEndDate;
};

/**
 * Returns Date of week start(Monday) for given year and week
 * @param {int} year
 * @param {int} week
 * @returns {Date} Date of week start (Monday)
 */
Date.createFromYearAndWeek = function(year, week) {
    var 
        objDate = new Date("Jan 01 2015 00:00:00"),
        intYear = parseInt(year),
        intWeek = parseInt(week);

    if ( !isNaN(intYear) && !isNaN(intWeek) ) {
        objDate.setYear(intYear);
        objDate.setTime( objDate.getTime() + (intWeek*7-1)*24*60*60*1000);

        return objDate.getWeekStartDate();
    } else {
        throw new Error('[Date::createFromYearAndWeek] parameters are not numeric');
    }
};

/**
 * Calculates current week number for current Date
 * 
 * @returns {Number} Week number (weeks starting from Monday)
 */
Date.prototype.getWeek = function() {
    var
        tmpDate = this.getWeekStartDate(),
        currYear = tmpDate.getFullYear(),
        intWeekNumber = 0;

    tmpDate.setTime(this.getTime());
    while( tmpDate.getFullYear() >= currYear ) {
        intWeekNumber++;
        tmpDate.setTime( tmpDate.getTime() - 7*24*60*60*1000 );
    }
    
    if ( 1 > intWeekNumber ) {
        /*
         * Previous year week number according to ISO-8601
         */
        intWeekNumber = 0;
        currYear--;
        tmpDate.setTime(this.getTime());
        while( tmpDate.getFullYear() >= currYear ) {
            intWeekNumber++;
            tmpDate.setTime( tmpDate.getTime() - 7*24*60*60*1000 );
        }
    }
    
    return intWeekNumber;
};

/**
 * Replace specific characters in pattern with current Date data
 * Example : 
 * var d = new Date("24 june 2016 09:00");
 * d.format("%m/%d/%Y - %H:%i") => "06/24/2016 - 09:00"
 * d.format("%n/%d/%Y - %G.%i") => "6/24/2016 - 9.00"
 *
 * @param {string} format string, compatible with PHP date() format syntax
 * @returns {string} formatted string
 */
Date.prototype.format = function(pattern) {
    if ( "string" === typeof(pattern) ) {
        var 
            outString = pattern,
                    
            fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            
            date = this.getDate().toString(),
            fullDate = (this.getDate() < 10 ? '0' + this.getDate() : this.getDate().toString() ),
            
            month = (this.getMonth()+1).toString(),
            fullMonth = ( this.getMonth()+1 < 10 ? '0' + (this.getMonth()+1) : (this.getMonth()+1).toString()),
            
            hours = this.getHours().toString(),
            fullHours = (this.getHours() < 10 ? '0' + this.getHours() : this.getHours().toString() ),
            
            fullMinutes = (this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes().toString() ),
            
            fullSeconds = (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds().toString() ),
            
            fullWeek = (this.getWeek() < 10 ? '0' + this.getWeek() : this.getWeek().toString() ),
            fullYear = this.getFullYear().toString();

        outString = outString.replace(/%j/g, date);
        outString = outString.replace(/%d/g, fullDate);
        
        outString = outString.replace(/%n/g, month);
        outString = outString.replace(/%m/g, fullMonth);
        outString = outString.replace(/%F/g, fullMonthNames[this.getMonth()]);
        outString = outString.replace(/%M/g, shortMonthNames[this.getMonth()]);
        
        outString = outString.replace(/%G/g, hours);
        outString = outString.replace(/%H/g, fullHours);
        
        outString = outString.replace(/%i/g, fullMinutes);
        
        outString = outString.replace(/%s/g, fullSeconds);
        
        outString = outString.replace(/%W/g, fullWeek);
        outString = outString.replace(/%Y/g, fullYear);
        
        return outString;
    } else {
        throw new Error('[Date::format] parameter must be of a String type');
    }
};
