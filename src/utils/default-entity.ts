import { Expose } from "class-transformer";
import { GROUP_ADMIN_USERS, GROUP_USER } from "src/app.module";
import { Column, Generated, PrimaryGeneratedColumn } from "typeorm";

export class DefaultEntity {
    @PrimaryGeneratedColumn('identity')
    @Expose({ groups: [GROUP_ADMIN_USERS] })
    id: number;
    
    @Column()
    @Expose({ groups: [GROUP_ADMIN_USERS] })
    active: boolean;

    @Column()
    @Generated("uuid")
    @Expose({ groups: [GROUP_USER, GROUP_ADMIN_USERS] })
    uuid: string;    
}
