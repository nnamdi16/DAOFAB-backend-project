const { default: axios } = require('axios');

/**
 * fetchParentTransaction: fetches all parents transaction from Parent.json
 */
exports.fetchParentTransaction = async () => {
   const response =  await axios.get('http://localhost:3000/parentRoute');
   return response.data;
   
}

/**
 * fetchChildTransaction: fetches all child transactions from Child.json
 */
exports.fetchChildTransaction = async () => {
    const response = await axios.get('http://localhost:3000/childRoute');
    return response.data;
}

/**
 * paginate:determines the how the backend displays the data based on the totalItems, currentPage, pageSize and the maxPages.
 * 
 * @param {number} totalItems Total number of items that is fetched from the json file
 * @param {number} currentPage Current page number 
 * @param {number} pageSize The number of items to be displayed per page
 * @param {number} maxPages Maximum number of items to be displayed per page.
 */
exports.paginate = (
    totalItems,
    currentPage =1,
    pageSize=2,
    maxPages=2
) => {

//  Calculate the total pages
let totalPages = Math.ceil(totalItems/pageSize);

//Ensure the current page is not out of range 
if (currentPage < 1) {
    currentPage = 1;
} else if (currentPage > totalPages) {
    currentPage = totalPages;
}

let startPage, endPage;
if (totalPages <= maxPages) {
    //total pages is less than the maximum so show all pages

    startPage = 1;
    endPage=totalPages
} else {
    //total pages more than max so calculate start and end pages.
    let maxPagesBeforeCurrentPage = Math.floor(maxPages/2);
    let maxPagesAfterCurrentPage = Math.ceil(maxPages/2);
    if (currentPage <= maxPagesBeforeCurrentPage) {
        //current page near the start 
        startPage = 1;
        endPage = maxPages; 
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        //current page near the end 
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
    }
    else {
        //current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
    }
}

//calculate start and end item indexed
let startIndex = (currentPage - 1) * pageSize;
let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

//create an array of pages to repeat the page control 

let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

//return object with all pages properties required by the view
return {
    totalItems,
    currentPage,
    totalPages,
    startPage,
    endPage,
    startIndex,
    endIndex,
    pages
};

}
/**
 * filterChildTransactionByParentId method filters child transaction based on the parentId.
 * @param {{sender:string, totalAmount:number, receiver: string,parentId:number}} transaction 
 */
function filterChildTransactionByParentId (transaction) {
         transaction.sender = this.sender;
            transaction.receiver = this.receiver;
            transaction.totalAmount = this.totalAmount;
            return transaction.parentId === this.parentId
}

module.exports.filterChildTransactionByParentId= filterChildTransactionByParentId;


