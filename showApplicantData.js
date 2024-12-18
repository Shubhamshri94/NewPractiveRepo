import { api, LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccountData from '@salesforce/apex/ApplicantAccountData.returnAccountData';

export default class ShowApplicantData extends NavigationMixin(LightningElement) {
    @api recordId;
    @api AccountId;
    accountName;
    accountType;
    accountPhone;
    accountRating;
    isAccountAvailable = false;
    message;

    @wire(getAccountData, { contactId: "$recordId" })
    accountData({ error, data }) {
        if (data) {
            console.log('contact.data' + data);
            if (data != null && data != undefined && data.length > 0) {
                data.forEach(element => {
                    this.isAccountAvailable = true;
                    this.AccountId = element.Id;
                    this.accountName = element.Name;
                    this.accountType = element.Type;
                    this.accountPhone = element.Phone;
                });
            }
            else {
                this.isAccountAvailable = false;
                this.message = 'Account is not associated';
            }

            console.log('AccountId-->' + this.AccountId);
        }
        else if (error) {
            this.isAccountAvailable = false;
            this.message = 'Account is not associated';
            console.log('contact.error' + error);
        }
    };

    handleNavigate(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.AccountId,
                actionName: 'view'
            }
        });
    }
}