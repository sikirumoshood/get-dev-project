<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Expenses;
class ExpensesController extends Controller
{
    public function __construct()
    {
        $this->middleware('verifyApiRequestToken');
      
    }

    
    public function index()
    {
        return view('dashboard');
    }

    public function store(Request $req){


        $validator = Validator::make($req->all(),[
            'exp_value' => 'required|numeric',
            'exp_value_pound' => 'required|numeric',
            'exp_vat'=>'required|numeric',
            'exp_date' => 'required|date',
            'exp_reason'=>'required|string'
        ] );
        if($validator->fails()){
            $resErrData = ['type' => 'inputErrors','errors'=>$validator->messages()];
            return response()->json($resErrData,400);
        }
        else{
            $valData = $req->all();
            $valData['user_id'] = $req->user()['id'];
            Expenses::create($valData);
            
            return $valData;
        }
        
        
    }

}
