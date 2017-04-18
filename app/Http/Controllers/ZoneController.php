<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Zone;

class ZoneController extends Controller{

    /**
    * Display a listing of the resource.
    *
    * @return Response
    */
    public function index() {
        $Zones = Zone::all();
        // Se obtienen los puntos correspodientes.
        foreach($Zones as $zone){
            $zone->points = $zone->geopoints()->get();
        }
        return $Zones;
    }

    /**
    * Store a newly created resource in storage.
    *
    * @return Response
    */
    public function store() {
        $Zone = Zone::create(Request::all());
        return $Zone;
    }

    /**
    * Update the specified resource in storage.
    *
    * @param  int  $id
    * @return Response
    */
    public function update($id) {
        $Zone = Zone::find($id);
        $Zone->name = Request::input('name');
        $Zone->description = Request::input('description');
        $Zone->save();

        return $Zone;
    }

    /**
    * Update the specified resource in storage.
    *
    * @param  int  $id
    * @return Response
    */
    public function show($id) {
        $Zone = Zone::find($id);

        return $Zone;
    }

    /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return Response
    */
    public function destroy($id) {
        Zone::destroy($id);
    }
}