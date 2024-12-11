import React from 'react';


const JasInvoice = React.forwardRef(({ invoice }, ref) => {
    console.log("invoice", invoice)

    // Extract important data from the response
    const { order_id, createdAt, updatedItems, user, dispatchedTable } = invoice;
    //   const { pickup_details, drop_details } = porterData;
    //   const { name: userName, email: userEmail } = user;

    const formattedDate = new Date(invoice.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).replace(/ /g, '/');



    return (
        <div className="invoice-container" ref={ref}>
            <h4 style={{ textAlign: 'center', fontWeight: 'bolder' }}><u>INVOICE</u></h4>
            <div className="invoice-header">
                <div className="top-info">
                    <div>
                        <p>Invoice No: {invoice.invoiceNumber}</p>
                        <p>Date: {formattedDate}</p>
                    </div>
                </div>
                <div className="middle-info">
                    <div>
                        <h4 style={{ fontWeight: 'bolder' }}><u>Supplier</u></h4>
                        <p style={{ fontWeight: 'bolder' }}>JAS FRUITS AND VEGETABLES</p>
                        <p>29 Reddy Street, Nerkundram</p>
                        <p>Chennai-600107</p>
                    </div>
                    <div>
                        <div>
                            <h4 style={{ fontWeight: 'bolder' }}><u>Buyer</u></h4>
                            <p style={{ fontWeight: 'bolder' }}>{invoice.user.name}</p>
                            <p>{invoice.orderDetail.shippingInfo.address},{invoice.orderDetail.shippingInfo.area}</p>
                            <p>{invoice.orderDetail.shippingInfo.city}-{invoice.orderDetail.shippingInfo.postalCode}</p>
                        </div>
                        <div>
                            <h5 style={{ fontWeight: 'bolder', marginTop: '20px' }}><u>Notify</u></h5>
                            <p>{invoice.user.name}</p>
                            <p>{invoice.orderDetail.shippingInfo.address},{invoice.orderDetail.shippingInfo.area}</p>
                            <p>{invoice.orderDetail.shippingInfo.city}-{invoice.orderDetail.shippingInfo.postalCode}</p>
                        </div>
                    </div>


                </div>

                <div className="bottom-info">
                    <div>

                        <p>Commodity</p>
                        <p>OrderID</p>
                        <p>Place of Origin of Goods </p>
                        <p>Place of Final Destination </p>
                        <p>Payment in Advance</p>
                        <p> CONTACT NUMBER </p>
                    </div>
                    <div className="bottom-data">

                        <p>VEGETABLES SUPPLY</p>
                        <p>{invoice.order_id}</p>
                        <p>Chennai - Koyembedu</p>
                        <p>{invoice.orderDetail.shippingInfo.city}-{invoice.orderDetail.shippingInfo.area}</p>
                        <p>{invoice?.orderDetail?.statusResponse?.txn_id}</p>
                        <p>9176883506</p>
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
                                <td>{parseFloat(item.dispatchedWeight * item.pricePerKg).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    {/* <tfoot className="print-only-on-second-page">
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'right' }}>Total (Inclusive of all taxes)</td>
                            <td>{invoice.totalDispatchedAmount}</td>
                        </tr>
                    </tfoot> */}
                    <tfoot>
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'right' }}>Total (Inclusive of all taxes)</td>
                            <td>{invoice.totalDispatchedAmount}</td>
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