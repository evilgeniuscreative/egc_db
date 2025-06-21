module app.listings {
    export interface IListings extends ng.resource.IResource<IListing> {
        registration:IListing[];
    }
}