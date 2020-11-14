const {fetchParentTransaction, paginate, fetchChildTransaction} = require('./transaction.service')

exports.fetchTransaction = async(req,res) => {
    try {
        const [parentTransaction,childTransaction] = await Promise.all([fetchParentTransaction(), fetchChildTransaction()]);
        // console.log(parentTransaction,childTransaction);
        // const result =  fetchParentTransaction().then(data =>{
        //     console.log(data.data);
            const PAGE_SIZE =  parentTransaction.data.length;
            console.log(PAGE_SIZE);
            const page = parseInt(req.query.page);
            const pager = paginate(PAGE_SIZE,page);
            const result = parentTransaction.data.slice(pager.startIndex,pager.endIndex+1)
            const tableInfo = [];
            for (let index = 0; index < result.length; index++) {
                let paymentMade = 0;
                childTransaction.data.find((child,num) => {  
                    if (child.parentId === result[index].id) {
                        paymentMade += child.paidAmount
                    }
                });

                result[index].paidAmount = paymentMade;

                
                tableInfo.push(result[index]);
                
            }
            

        //     res.json({
        //         message:'Received',
        //         result
        //     })
        // });

          
        return res.json({
            message:'Received',
            tableInfo
        })
        // console.log(transactionDetails);
        // // @ts-ignore
        // const {error, data} = transactionDetails;
        // if (error) {
        //     return res.status(200).json(
        //         {
        //             success: false,
        //         }
        //     )
        // }

    } catch (error) {
        res.status(500).json(
            {
                success: error,
                message: error.message
            }
        )
    }
}