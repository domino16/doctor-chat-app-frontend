import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators"
import { rootState } from "../store/rootState";
import { AuthService } from "./auth.service";
import { authUser } from "./store/auth.selector";

@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate{

constructor( private router: Router, private store:Store<rootState>){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
return this.store.select(authUser).
pipe(take(1),map(user =>{
  const isAuth = !!user
  if(isAuth){
    return true;
  }
  return this.router.createUrlTree(['/login']);
 }),

 )
  }
}
