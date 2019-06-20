<?php

namespace App\Http\Middleware;

use Closure;


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

        if($request->ajax()){
             
            
             $token = $request->user()['api_token'];
             if(!$token){
                return response()->json(['Access denied' => 'Unauthorized access'], 401);
             }
             
         }
        return $next($request);
    }
}
