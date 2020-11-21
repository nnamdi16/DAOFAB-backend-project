const {fetchParentTransaction, paginate, fetchChildTransaction} = require('./transaction.service')

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

exports.fetchChildTransactionByParentId= async(req, res) => {
    try {
        const parentId = parseInt(req.query.id);
        const childTransaction = await fetchChildTransaction();
        const isEmpty = Object.keys(childTransaction).length === 0
        if (childTransaction == undefined || isEmpty) {
            return res.status(404).json({
                message:'Child transaction does not exist'
            });
        }
        const response = childTransaction.data.filter((transaction) => transaction.parentId === parentId);
        return res.status(200).json({
                message:'SUCCESS',
                data:response
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