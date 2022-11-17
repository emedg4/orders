export class OrdersExceptions {

    constructor( private moduleName: string, private funcName: string){

    }

    async tenantDoesntExist(tenant: any){
        return {
            status: 200,
            message: "Tenant does not exist",
            possibleSolution:`Create mold with tenant: ${tenant}`,
            data:{
                tenantTried: tenant
            }
        }

    }
}