import React from 'react';


const JasInvoice = React.forwardRef(({ invoice }, ref) => {
    console.log("invoice",invoice)

      // Extract important data from the response
      const { order_id, createdAt, updatedItems, user, dispatchedTable } = invoice;
    //   const { pickup_details, drop_details } = porterData;
    //   const { name: userName, email: userEmail } = user;

    return (
        <div className="invoice-container" ref={ref}>
            <h1 style={{ textAlign: 'center' }}><u>INVOICE</u></h1>
            <div className="invoice-header">
                <div className="top-info">
                    <div>
                        <p>Invoice No: {invoice.order_id}</p>
                        <p>Date: {invoice.createdAt}</p>
                    </div>
                </div>
                <div className="middle-info">
                    <div>
                        <h3><u>Supplier</u></h3>
                        <p>JAS FRUITS AND VEGETABLES</p>
                        <p>29 Reddy Street, Nerkundram</p>
                        <p>Chennai-600107</p>
                    </div>
                    <div>
                        <h3><u>Buyer</u></h3>
                        <p>{invoice.user.name}</p>
                        <p>{invoice.orderDetail.shippingInfo.address}</p>
                        <p>{invoice.orderDetail.shippingInfo.city}-{invoice.orderDetail.shippingInfo.postalCode}</p>
                    </div>
                </div>
                <div className="bottom-info">
                    <div>
                        
                        <p>Commodity</p>
                        <p>DIVISION</p>
                        <p>Place of Origin of Goods </p>
                        <p>Place of Final Destination </p>
                        <p>Terms of Delivery and Payment </p>
                        <p> CONTACT NUMBER </p>
                    </div>
                    <div className="bottom-data">
                        
                        <p>VEGETABLES SUPPLY</p>
                        <p>{invoice.user.name}</p>
                        <p>Chennai - Koyembedu</p>
                        <p>{invoice.orderDetail.shippingInfo.address}</p>
                        <p>7 days from GRN Date</p>
                        <p>9840814398,9176720068</p>
                    </div>
                </div>
            </div>

            <div className="invoice-body">
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Description of Goods</th>
                            <th>Order KG</th>
                            <th>Excess/Minus</th>
                            <th>Total KG</th>
                            <th>Rate per KG</th>
                            <th>Value in Rupee</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.dispatchedTable.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.orderedWeight}</td>
                                <td>{item.refundableWeight}</td>
                                <td>{item.dispatchedWeight}</td>
                                <td>{item.pricePerKg}</td>
                                <td>{item.dispatchedWeight*item.pricePerKg}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'right' }}>Total</td>
                            <td >
                                {invoice.totalDispatchedAmount}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="invoice-footer">
            <div className="info">
                    <p>The price actually charged by us and there is no additional consideration flowing directly or indirectly from such sales over and what has been declared</p>
                   
                </div>

                <div className="signature">
                    <p>Authorised Signatory</p>
                    {/* <p>{invoice.supplier.name}</p> */}
                </div>
            </div>
        </div>
    );
});

export default JasInvoice;