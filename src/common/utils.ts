import {OrgRole, User} from "../types";
import {config} from "@grafana/runtime";

export function hasRole(role: OrgRole){
    const user : User = config.bootData.user;

    switch (role) {
        case OrgRole.ADMIN: {
            return user.orgRole === OrgRole.ADMIN;
        }
        case OrgRole.EDITOR: {
            return user.orgRole === OrgRole.ADMIN || user.orgRole === OrgRole.EDITOR;
        }
        case OrgRole.VIEWER: {
            return user.orgRole === OrgRole.ADMIN || user.orgRole === OrgRole.EDITOR || user.orgRole === OrgRole.VIEWER;
        }
        default: {
            return false;
        }
    }
}