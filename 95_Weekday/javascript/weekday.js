// WEEKDAY
//
// Converted from BASIC to Javascript by Oscar Toledo G. (nanochess)
//

function print(str) {
    document.getElementById("output").appendChild(document.createTextNode(str));
}

function input() {
    return new Promise(function (resolve) {
        const input_element = document.createElement("INPUT");

        print("? ");
        input_element.setAttribute("type", "text");
        input_element.setAttribute("length", "50");
        document.getElementById("output").appendChild(input_element);
        input_element.focus();
        input_element.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                const input_str = input_element.value;
                document.getElementById("output").removeChild(input_element);
                print(input_str);
                print("\n");
                resolve(input_str);
            }
        });
    });
}

function tab(space) {
    let str = "";
    while (space-- > 0)
        str += " ";
    return str;
}

// in a non-leap year the day of the week for the first of each month moves by the following amounts.
const COMMON_YEAR_MONTH_OFFSET = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];

/**
 * Reads a date, and extracts the date information.
 * This expects date parts to be comma separated, using US date ordering,
 * i.e. Month,Day,Year.
 * @returns {Promise<[number,number,number]>} [year, month, dayOfMonth]
 */
async function readDateElements() {
    let dateString = await input();
    const month = parseInt(dateString);
    const dayOfMonth = parseInt(dateString.substr(dateString.indexOf(",") + 1));
    const year = parseInt(dateString.substr(dateString.lastIndexOf(",") + 1));
    return [year, month, dayOfMonth];
}

/**
 * Returns a US formatted date, i.e. Month/Day/Year.
 * @param year
 * @param month
 * @param day
 * @returns {string}
 */
function getFormattedDate(year, month, day) {
    return month + "/" + day + "/" + year;
}

/**
 * Calculate years, months and days as factor of days.
 * This is a naive calculation which assumes all months are 30 days.
 * @param factor
 * @param dayCount
 * @returns {{years: number, months: number, days: number}}
 */
function time_spent(factor, dayCount) {
    let totalDays = Math.floor(factor * dayCount);
    const years = Math.floor(totalDays / 365);
    totalDays -= years * 365;
    const months = Math.floor(totalDays / 30);
    const days = totalDays - (months * 30);
    return {years, months, days}
}

/**
 * Print the supplied time
 * @param years
 * @param months
 * @param days
 */
function printTimeSpent({years, months, days}) {
    print(years + "\t" + months + "\t" + days + "\n");
}

/**
 * Adjust unaccounted time by remove years, months and days supplied.
 * @param {{years:number, months:number, days:number}} unaccountedTime
 * @param {{years:number, months:number, days:number}} timeToRemove
 */
function adjustUnaccountedTime(unaccountedTime, timeToRemove) {
    unaccountedTime.years -= timeToRemove.years;
    unaccountedTime.months -= timeToRemove.months;
    unaccountedTime.days -= timeToRemove.days;
    if (unaccountedTime.days < 0) {
        unaccountedTime.days += 30;
        unaccountedTime.months--;
    }
    if (unaccountedTime.months <= 0) {
        unaccountedTime.months += 12;
        unaccountedTime.years--;
    }
}

function isLeapYear(year) {
    if ((year % 4) !== 0) {
        return false;
    } else if ((year % 100) !== 0) {
        return true;
    } else if ((year % 400) !== 0) {
        return false;
    }
    return true;
}

/**
 * Determine the day of the week.
 * This calculation returns a number between 1 and 7 where Sunday=1, Monday=2, ..., Saturday=7.
 * First it calculates a known date near the start of the century (defined as a year ending "00").
 * January 1st in "00" years is always one of: Saturday (years divisible by 400), Friday, Wednesday, or Monday.
 * This is a combination of years being 52 weeks and either 1 (non-leap years) or 2 (leap years) days,
 * and years ending "00" only being leap years if they are also divisible by 400.
 * @param year
 * @param month
 * @param day
 * @returns {number} Value between 1 and 7 representing Sunday to Saturday.
 */
function getDayOfWeek(year, month, day) {
    const centuriesSince1500 = Math.floor((year - 1500) / 100);
    let centuryOffset = centuriesSince1500 * 5 + (centuriesSince1500 + 3) / 4;
    centuryOffset = Math.floor(centuryOffset % 7);
    // January 1st moves forward by approximately 1.25 days per year
    const yearInCentury = year % 100;
    const yearInCenturyOffsets = yearInCentury / 4 + yearInCentury;

    let dayOfWeek = centuryOffset +  yearInCenturyOffsets + day + COMMON_YEAR_MONTH_OFFSET[month-1];
    dayOfWeek = Math.floor(dayOfWeek % 7) + 1;
    if (month <= 2 && isLeapYear(year)) {
        dayOfWeek--;
    }
    if (dayOfWeek === 0) {
        dayOfWeek = 7;
    }
    return dayOfWeek;
}

/**
 * The following performs a special hash on the day parts which guarantees
 * that different days will return different numbers, and the numbers returned are in ordered.
 * @param year
 * @param month
 * @param day
 * @returns {*}
 */
function getNormalisedDay(year, month, day) {
    return (year * 12 + month) * 31 + day;
}

// Main control section
async function main() {
    print(tab(32) + "WEEKDAY\n");
    print(tab(15) + "CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY\n");
    print("\n");
    print("\n");
    print("\n");
    print("WEEKDAY IS A COMPUTER DEMONSTRATION THAT\n");
    print("GIVES FACTS ABOUT A DATE OF INTEREST TO YOU.\n");
    print("\n");
    print("ENTER TODAY'S DATE IN THE FORM: 3,24,1979  ");
    const [todayYear, todayMonth, todayDayOfMonth] = await readDateElements();
    // This program determines the day of the week
    //  for a date after 1582
    print("ENTER DAY OF BIRTH (OR OTHER DAY OF INTEREST)");
    const [dobYear, dobMonth, dobDayOfMonth] = await readDateElements();
    print("\n");
    // Test for date before current calendar.
    // Note: this test is unreliable - the Gregorian calendar was introduced on Friday 15 October 1582
    // and the weekday algorithm fails for dates prior to that
    if (dobYear - 1582 < 0) {
        print("NOT PREPARED TO GIVE DAY OF WEEK PRIOR TO MDLXXXII.\n");
    } else {
        const dayOfWeek = getDayOfWeek(dobYear, dobMonth, dobDayOfMonth);

        const normalisedToday = getNormalisedDay(todayYear, todayMonth, todayDayOfMonth);
        const normalisedDob = getNormalisedDay(dobYear, dobMonth, dobDayOfMonth);

        if (normalisedToday < normalisedDob) {
            print(getFormattedDate(dobYear, dobMonth, dobDayOfMonth) + " WILL BE A ");
        } else if (normalisedToday === normalisedDob) {
            print(getFormattedDate(dobYear, dobMonth, dobDayOfMonth) + " IS A ");
        } else {
            print(getFormattedDate(dobYear, dobMonth, dobDayOfMonth) + " WAS A ");
        }
        switch (dayOfWeek) {
            case 1:
                print("SUNDAY.\n");
                break;
            case 2:
                print("MONDAY.\n");
                break;
            case 3:
                print("TUESDAY.\n");
                break;
            case 4:
                print("WEDNESDAY.\n");
                break;
            case 5:
                print("THURSDAY.\n");
                break;
            case 6:
                if (dobDayOfMonth === 13) {
                    print("FRIDAY THE THIRTEENTH---BEWARE!\n");
                } else {
                    print("FRIDAY.\n");
                }
                break;
            case 7:
                print("SATURDAY.\n");
                break;
        }
        if (normalisedToday !== normalisedDob) {
            let yearsBetweenDates = todayYear - dobYear;
            print("\n");
            let monthsBetweenDates = todayMonth - dobMonth;
            let daysBetweenDates = todayDayOfMonth - dobDayOfMonth;
            if (daysBetweenDates < 0) {
                monthsBetweenDates--;
                daysBetweenDates += 30;
            }
            if (monthsBetweenDates < 0) {
                yearsBetweenDates--;
                monthsBetweenDates += 12;
            }
            if (yearsBetweenDates >= 0) {
                if (daysBetweenDates === 0 && monthsBetweenDates === 0) {
                    print("***HAPPY BIRTHDAY***\n");
                }
                print("                        \tYEARS\tMONTHS\tDAYS\n");
                print("                        \t-----\t------\t----\n");
                print("YOUR AGE (IF BIRTHDATE) \t" + yearsBetweenDates + "\t" + monthsBetweenDates + "\t" + daysBetweenDates + "\n");
                const approximateDaysBetween = (yearsBetweenDates * 365) + (monthsBetweenDates * 30) + daysBetweenDates + Math.floor(monthsBetweenDates / 2);
                // Create an object containing time unaccounted for
                const unaccountedTime = {years: yearsBetweenDates, months: monthsBetweenDates, days: daysBetweenDates};

                // Calculate time spent in the following functions.
                print("YOU HAVE SLEPT \t\t\t");
                const sleepTimeSpent = time_spent(0.35, approximateDaysBetween);
                printTimeSpent(sleepTimeSpent);

                adjustUnaccountedTime(unaccountedTime, sleepTimeSpent);
                print("YOU HAVE EATEN \t\t\t");
                const eatenTimeSpent = time_spent(0.17, approximateDaysBetween);
                printTimeSpent(eatenTimeSpent);

                adjustUnaccountedTime(unaccountedTime, eatenTimeSpent);
                if (unaccountedTime.years <= 3) {
                    print("YOU HAVE PLAYED \t\t\t");
                } else if (unaccountedTime.years <= 9) {
                    print("YOU HAVE PLAYED/STUDIED \t\t");
                } else {
                    print("YOU HAVE WORKED/PLAYED \t\t");
                }
                const workPlayTimeSpent = time_spent(0.23, approximateDaysBetween);
                printTimeSpent(workPlayTimeSpent);

                adjustUnaccountedTime(unaccountedTime, workPlayTimeSpent);
                if (unaccountedTime.months === 12) {
                    unaccountedTime.years++;
                    unaccountedTime.months = 0;
                }
                print("YOU HAVE RELAXED \t\t");
                printTimeSpent(unaccountedTime)

                const retirementYear = dobYear + 65;
                print("\n");
                print(tab(16) + "***  YOU MAY RETIRE IN " + retirementYear + " ***\n");
                print("\n");
            }
        }
    }
    print("\n");
    print("\n");
    print("\n");
    print("\n");
    print("\n");
}

main();
