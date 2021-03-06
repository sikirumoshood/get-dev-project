@extends('layouts.app')

@section('content')

<div class="container">
    <!--====================================== START OF ADD NEW EXPENSES PANE ================================= -->

    <span hidden  id="key">{{Auth::user()->api_token}}</span>
    <div class="row justify-content-center">
        <div class="col-11" id="p-form-card">
            <span > <h5 class="ml-3 mt-3"><i class="fa fa-plus"  style="color:purple"> </i>  Add new expenses</h5> <hr/> </span>
            <div id="form-card">
                <div class="alert alert-danger" id="alert" style="display:none"></div>
                <form id="exp_form">

                   
                <div class="row">
                        <div class="col-md-3 m-3">
                                <label for="exp_value"><i class="fa fa-euro"></i> Expense value <span style="color:red"> *</span></label>
                                <input id="exp_value" class="form-control" type="text" name="exp_value" required>
                                <small class="text text-muted">Format: decimal number can be comma separated followed by a space then EUR. e.g(2,345.56 EUR)</small>
                            
                        </div>
                        <div class="col-md-3 m-3">
                                <label for="exp_value_pound"><i class="fa fa-gbp" ></i> Value (in pounds)</label>
                                <input  id="exp_value_pound" class="form-control" type="text" name="exp_value_pound" value=0.00 readonly>
                                <small class="text text-primary" id="rate"></small>
                        </div>
                        <div class=" col-md-4 mt-3 ml-3">
                                <label for="exp_vat"><i class="fa fa-gbp"></i> VAT (20% of expense value)</label>
                                <input  id="exp_vat" class="form-control" type="text" name="exp_vat"value=0.00 readonly>
                               
                        </div>
                        
                </div>
                <div class="row">
                
                    <div class="col-md-3 m-3">
                            <label for="exp_date"><i class="fa fa-calendar-o"></i> Date of expense <span style="color:red"> *</span></label>
                            <input  id="exp_date" class="form-control" type="date" name="exp_date" required>
                        
                        </div>
                        <div class="col-md-7 mt-3 ml-3 ">
                            <label for="exp_reason"><i class="fa fa-lightbulb-o"> </i> Reason for expense <span style="color:red"> *</span></label>
                            <textarea  id="exp_reason" class="form-control" type="text" name="exp_reason" required></textarea>
                        
                        </div>
                
                </div>
                    
                <div class="row">
                    <div class="col-md-3">

                        <div class="form-group" style="margin-left:18px;margin-top:29px;margin-right:29px;">
                                <div >
                                
                                    <button  id="save" class="btn btn-lg btn-primary"> <i class="fa fa-save"></i> Save Expense</button>
                                
                                </div>
                            
                        </div>
                    </div>
                    <div class="col-md-4 ml-3 mt-5 ">
                            <span id="progress" style="display:none"> <i class="fa fa-spinner fa-pulse"> </i> {{" "}}Saving...</span>
                            <span id="status"></span>
                    </div>
                    

                    

                </div>    
                
                </form>

                    
                   


            </div>
        </div>
    </div>

    <!--====================================== END OF ADD NEW EXPENSES PANE ================================= -->

    <!--======================================= SUBMITTED EXPENSES PANE ===================================  -->
    <div class="row justify-content-center mt-4">

        <div class="col-11 table-pane" style="border-top-width:1px">

                <span > <h5 class="ml-3 mt-3"><i class="fa fa-list-alt  " style="color:purple"> </i>  Submitted expenses (<span id="total" style="color:green; font-size:bold"></span>)</h5> <hr/> </span>

                <!-- EXPENSES TABLE -->
                <div class="table-responsive">
                <i class="fa fa-spinner fa-spin" id="loading-data" style="display:none"></i>
                    <table id="exp_table" class="table table-bordered  ">

                        <thead>
                            <tr>
                                <th>REASON <i class="fa fa-light-bulb"></i> </th>
                                <th>VALUE <i class="fa fa-euro"></i></th>
                                <th>VALUE <i class="fa fa-gbp"></i></th>
                                <th>VAT <i class="fa fa-gbp"></i></th>
                                <th>DATE <i class="fa fa-calender-o"></i></th>
                            </tr>

                        </thead>
                        
                        <tbody id="t-body">
                        

                        </tbody>

                    </table>
                </div>
                

             <div class="float-right">
                <div class="form-inline">
                        <button type="button" id="prev" class="btn prev"><i class="fa fa-chevron-left "></i></button>
                        <button type="button" id="next" class="btn next"><i class="fa fa-chevron-right "></i></button>
                </div>
            </div>

        </div>
 

    </div>
    <div name="spacer" style="margin-top:40px"></div>
         
    
</div>
@endsection
