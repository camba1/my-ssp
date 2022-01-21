import { ArnPrincipal } from "@aws-cdk/aws-iam";
import { PlatformTeam } from '@aws-quickstart/ssp-amazon-eks';

export class TeamPlatform extends PlatformTeam {
    constructor(accountID: string) {
        super({
            name: "platform",
            users: [new ArnPrincipal(`arn:aws:iam::970979109377:role/platform-team-role-71c7b960`)]
        })
    }
}