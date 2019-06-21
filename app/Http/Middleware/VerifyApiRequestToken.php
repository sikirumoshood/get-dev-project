<?php

namespace App\Http\Middleware;

use Closure;
use App\User;


class VerifyApiRequestToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
       
        

        //API REQUESTS VIA api/* must contain a valid bearer token representing the user.
        if($request->ajax()){
             
            
             $token = $request->user()['api_token'];
             if(!$token){
                //Then check if its a pure api request and not a web route. Check authorization header
                if(isset($request->headers->all()['authorization']))
                {
                    $tokenWithBearer = $request->headers->all()['authorization'][0];
                    //Remove 'Bearer' from the value
                    $token = explode(' ',$tokenWithBearer)[1];
                    //validate bearer token
                
                    $user = User::where('api_token', $token)->first();
                    if($user === null){
                        return response()->json(['type'=>'accessError','Access denied' => 'Unauthorized access'], 401);
                    }
                    //Allow passage

                }else{
                    return response()->json(['type'=>'accessError','Access denied' => 'Unauthorized access'], 401);
                }
               
             }
             
         }
        return $next($request);
    }
}
