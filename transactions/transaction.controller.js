const {fetchParentTransaction, paginate, fetchChildTransaction,filterChildTransactionByParentId} = require('./transaction.service')

/**
 * fetchParentTransaction controller fetches all parent transactions
 */
exports.fetchParentTransaction = async(req,res) => {
    try {
    const data = await fetchParentTransaction();
    const isEmpty = Object.keys(data).length === 0
    console.log(data);
    if (data == undefined || isEmpty) {
        return res.status(404).json({
            message:'Parent Transaction does not exist'
        });
    }
    const {data:response} = data;
    return res.status(200).json({
        message:'SUCCESS',
        response
    })
  
    } catch (error) {
        res.status(500).json(
            {
                success: error,
                message: error.message
            }
        )
    }
}

/**
 * fetchChildTransactionByParentId controller fetches all child transactions based on the parentId
 */
exports.fetchChildTransactionByParentId= async(req, res) => {
    try {
        const parentId = parseInt(req.query.id);
        const [parentTransaction,childTransaction] = await Promise.all([fetchParentTransaction(), fetchChildTransaction()]);
        const isEmpty = Object.keys(childTransaction).length === 0
        if (childTransaction == undefined || isEmpty) {
            return res.status(404).json({
                message:'Child transaction does not exist'
            });
        }
        if (parentTransaction == undefined || isEmpty) {
            return res.status(404).json({
                message:'Parent transaction does not exist'
            });
        }
        //filter parentTransaction based when the parent transaction id is equal to parentId
        const parentResponse = parentTransaction.data.filter((transaction) => transaction.id === parentId);
        const {sender, receiver,totalAmount} = parentResponse[0];
        const parentDetail = {sender,receiver,parentId,totalAmount}

        //filter childTransaction based when the parent transaction id is equal to parentId
        const response = childTransaction.data.filter(filterChildTransactionByParentId,parentDetail);
        
        return res.status(200).json({
                message:'SUCCESS',
                data:response,
        })
    } catch (error) {
        res.status(500).json(
            {
                success: error,
                message: error.message
            }
        )
        
    }

}

/**
 * fetchTransaction controller fetches all parent transactions and renders the output based on server side pagination
 */
exports.fetchTransaction = async(req,res) => {
    try {
        const [parentTransaction,childTransaction] = await Promise.all([fetchParentTransaction(), fetchChildTransaction()]);
            console.log('We are here');
            const PAGE_SIZE =  parentTransaction.data.length;
            const page =req.query.page==undefined ? 1 : parseInt(req.query.page);
            const paginationResponse = paginate(PAGE_SIZE,page);
            const result = parentTransaction.data.slice(paginationResponse.startIndex,paginationResponse.endIndex+1)
            const data = [];
            for (let index = 0; index < result.length; index++) {
                let paymentMade = 0;             
                childTransaction.data.find((child,num) => {  
                    if (child.parentId === result[index].id) {
                        paymentMade += child.paidAmount
                    }
                });
                result[index].paidAmount = paymentMade;
                data.push(result[index]);
                
            }    
        return res.status(200).json({
            message:'SUCCESS',
            data,
            paginationResponse
        })

    } catch (error) {
        res.status(500).json(
            {
                success: error,
                message: error.message
            }
        )
    }
}