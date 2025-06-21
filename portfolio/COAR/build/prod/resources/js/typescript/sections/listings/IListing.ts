module app.listings {
    export interface IListing extends ng.resource.IResource<IListing> {
        locked:boolean;
        approved:boolean;
        created:string;
        expires:string;
        hasOwnershipToAccept:boolean;
        hasOwnerToapprove:boolean;
        type:string;
        emanApplicationName:string;
        consumerKey:string;
        consumerSecret:string;
        description:string;
        expiresDays: number;
        showExpanded: string;
    }
}