<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Expenses extends Model
{
   protected $fillable = [
     	'exp_value','exp_value_pound'	,'exp_vat',	'exp_reason',	'exp_date'	,'created_at',	'updated_at',	'user_id'
   ];
}
