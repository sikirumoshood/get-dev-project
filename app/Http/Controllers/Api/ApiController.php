<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Expenses;
use App\User;

class ApiController extends Controller
{
    public function __construct()
    {
        $this->middleware('verifyApiRequestToken');
    
      
    }

    public function test(){

        return ['success' => true];
    }

    private function getUser($request){
        $tokenWithBearer = $request->headers->all()['authorization'][0];
                    //Remove 'Bearer' from the value
                    $token = explode(' ',$tokenWithBearer)[1];
                    //validate bearer token
                
                    $user = User::where('api_token', $token)->first();
                    return $user; //User can't be null and request reaches here. Middleware handles that
    }
   
    public function stat(Request $req){
        
        $user = $this->getUser($req);
        $count = Expenses::where('user_id',$user->id)->get()->count();
        return response()->json(['count' => $count]);
        
    }

    //This api uses 5 as the offset, hence min value of $skip must be 5, and only 5 expenses are always returned
    public function paginateNext(Request $req, $skip){

        $user = $this->getUser($req);
        $response = [];
        $response['expenses'] = Expenses::where('user_id',$user->id)->orderBy('created_at','desc')->skip($skip-5)->take($skip)->get();

        $response['paginate'] = [];

        $response['paginate']['next'] = Expenses::where('user_id',$user->id)->orderBy('created_at','desc')->skip($skip)->take($skip+5)->get()->count() > 0 ? true: false;
        $response['paginate']['prev'] = $skip - 10 >= 0 ? true: false; 
        return response()->json($response);

    }


    //This api uses 5 as the offset, hence min value of $skip must be 5, and only 5 expenses are always returned
    public function paginatePrev(Request $req, $skip){

        return $this->paginateNext($req,$skip); //Same logic as prev

    }

}
