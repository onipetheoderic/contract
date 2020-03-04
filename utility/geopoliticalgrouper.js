
function accumulator(total, num) {
    return total + num;
}
export const geopolitical_zone_calculator = (all_profiles) => {
    let south_south=[], north_central=[], north_east = [], south_east = [], south_west = [], north_west = []
    for(var i in all_profiles){
        let eachGeopolitical = all_profiles[i].geopolitical_zone
        console.log("thisss",all_profiles[i])
        if(eachGeopolitical!=undefined){
            if(eachGeopolitical==="north_central"){
                north_central.push(all_profiles[i])
            }
            else if(eachGeopolitical==="north_east"){
                north_east.push(all_profiles[i])
            }
            else if(eachGeopolitical==="south_east"){
                south_east.push(all_profiles[i])
            }
            else if(eachGeopolitical==="south_west"){
                south_west.push(all_profiles[i])
            }
            else if(eachGeopolitical==="south_south"){
                south_south.push(all_profiles[i])
            }
            else if(eachGeopolitical==="north_west"){
                north_west.push(all_profiles[i])
            }
        }
       
    }
    let _all_areas = [north_central.length, north_east.length, north_west.length, south_south.length, south_west.length, south_east.length,]
    let accumulatedScore = _all_areas.reduce(accumulator)
    const geopolitical_size = {
        north_central:north_central.length,
        north_east:north_east.length,
        north_west:north_west.length,
        south_south:south_south.length,
        south_west:south_west.length,
        south_east:south_east.length,
        total: accumulatedScore
    }
    return geopolitical_size
}


export const gender_calculator = (all_profiles) =>{
    let male=[], female=[]
    for(var i in all_profiles){
        let eachGender = all_profiles[i].user[0].gender
        console.log("gggggggg",eachGender)
        if(eachGender==="Female"){
            female.push(all_profiles[i])
        }
        else if(eachGender==="Male"){
            male.push(all_profiles[i])
        }
    }
    let _all_genders = [male.length, female.length]
    let accumulatedGender = _all_genders.reduce(accumulator)
    return {male:male.length, female:female.length, total_gender:accumulatedGender}
}