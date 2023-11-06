export function getRandomDate() {
    var startDate = new Date(2020, 0, 1);  // start date (January 1, 2020)
    var endDate = new Date();  // end date (current date)
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}