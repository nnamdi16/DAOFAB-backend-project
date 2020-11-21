const { default: axios } = require('axios');

exports.fetchParentTransaction = async () => {
   const response =  await axios.get('http://localhost:3000/parentRoute');
   return response.data;
   
}

exports.fetchChildTransaction = async () => {
    const response = await axios.get('http://localhost:3000/childRoute');
    return response.data;
}

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

function filterChildTransactionByParentId (transaction) {
         transaction.sender = this.sender;
            transaction.receiver = this.receiver;
            transaction.totalAmount = this.totalAmount;
            return transaction.parentId === this.parentId
}

module.exports.filterChildTransactionByParentId= filterChildTransactionByParentId;


