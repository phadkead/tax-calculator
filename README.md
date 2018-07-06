# tax-calculator

This is backend for tax calculation

As a user, 
I can authenticate
I can send:
A Superannuation percentage (>= 9.5%),
An income (> $0) as:
A Gross amount or,
A Gross + Superannuation amount
A tax rates year 
I should see the calculated amount of:
The Superannuation amount, 
The Gross amount if Gross + Superannuation has been entered,
The Gross + Superannuation amount if Gross has been entered,
The Tax amount (simple estimation excluding medicare levy or any extra),
The Net amount (net income received by the user after tax),
The Net + Superannuation amount,
I should be able to list and delete the history of calculations and their related tax rates.

## To start the project
- Run mongodb on local
- Do ```npm start``` and it should serve backend on http://localhost:3000
