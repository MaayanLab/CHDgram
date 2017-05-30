// load clustergram function
function load_clust(inst_view, inst_case){ $(function() {

  if (inst_view==='pheno'){
    d3.select('#ppi_instruct').style('display','none');
    d3.selectAll('.pheno_instruct').style('display','block');
  }

  if (inst_view==='ppi'){
    d3.select('#ppi_instruct').style('display','block');
    d3.selectAll('.pheno_instruct').style('display','none');
  }
  // reset ordering buttons
  d3.select('#toggle_order')
    .selectAll('label')
    .attr('class','btn btn-primary order_name');
  d3.select('#default_order')
    .attr('class','btn btn-primary order_name active');


  // load network
  d3.json('/CHDgram/static/networks/'+inst_view+'_'+inst_case+'.json', function(network_data){

    // define the outer margins of the visualization
    var outer_margins = {
        'top':5,
        'bottom':33,
        'left':225,
        'right':2
      };

    // define callback function for clicking on tile
    function click_tile_callback(tile_info){
      console.log('my callback');
      console.log('clicking on ' + tile_info.row + ' row and ' + tile_info.col + ' col with value ' + String(tile_info.value))
    }

    // define callback function for clicking on group
    function click_group_callback(group_info){
      console.log('running user defined click group callback');
      console.log(group_info.type);
      console.log(group_info.nodes);
      console.log(group_info.info);
    }

    var inst_row_label = 'Mutated Genes from ' + inst_case ;

    if (inst_view === 'pheno'){
      var inst_col_label = 'Mouse Cardiac Phenotypes';
    } else{
      var inst_col_label = inst_row_label;
    }

    // define arguments object
    var arguments_obj = {
      'network_data': network_data,
      'svg_div_id': 'svg_div',
      'row_label':inst_row_label,
      'col_label':inst_col_label,
      'outer_margins': outer_margins,
      'col_overflow':0.5,
      'col_label_scale':0.7,
      'tile_colors':['black','#1C86EE'],
    };

    // make clustergram: pass network_data and the div name where the svg should be made
    var d3c = d3_clustergram(arguments_obj);

    // Custom CHDgram changes
    /////////////////////////////////////////////

    var sam_opacity = d3.scale.linear().domain([0,10]).range([0,1]);

    // custom coloring for row classification
    d3.selectAll('.row_triangle_group')
      .select('path')
      .style('fill', 'blue')
      .style('opacity',function(d){
        return sam_opacity(d.cl);
      });

    d3.selectAll('.col_label_click')
      .select('path')
      .style('fill', 'blue')
      .style('opacity',function(d){
        return sam_opacity(d.cl);
      });

    // color the tiles based on the combined number of associated phenotypes
    var row_nodes = network_data.row_nodes;
    var col_nodes = network_data.col_nodes;
    var tile_scale = d3.scale.linear().domain([1,30]).range(['black','red']);

    d3.selectAll('.tile')
      .style('fill', function(d){
        var total_num_pheno = col_nodes[d.pos_x].value + col_nodes[d.pos_y].value;
        return tile_scale(total_num_pheno);
      });

    /////////////////////////////////////////////

    $('#gene_search_box').autocomplete({
      source: d3c.get_genes()
    });


    $( "#slider_col" ).slider({
      value:0.5,
      min: 0,
      max: 1,
      step: 0.1,
      slide: function( event, ui ) {

        // get inst_index from slider
        $( "#amount" ).val( "$" + ui.value );
        var inst_index = ui.value*10;

        // change group sizes
        d3c.change_groups('col',inst_index)

      }
    });

    $( "#amount" ).val( "$" + $( "#slider_col" ).slider( "value" ) );

    $( "#slider_row" ).slider({
      value:0.5,
      min: 0,
      max: 1,
      step: 0.1,
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.value );
        var inst_index = ui.value*10;

        // change group sizes
        d3c.change_groups('row',inst_index)
      }
    });
    $( "#amount" ).val( "$" + $( "#slider_row" ).slider( "value" ) );

    // submit genes button
    $('#gene_search_box').keyup(function(e) {
      if (e.keyCode === 13) {
        var search_gene = $('#gene_search_box').val();
        d3c.find_gene(search_gene);
      }
    });

    $('#submit_gene_button').off().click(function() {
      var gene = $('#gene_search_box').val();
      d3c.find_gene(gene);
    });


    $('#toggle_order .btn').off().click(function(evt) {
      var order_id = $(evt.target).find('input').attr('id').replace('_button', '');
      d3c.reorder(order_id);
    });

    });
  });

};

// initialize view and case
inst_case = 'Cases';
inst_view = 'ppi'
load_clust(inst_view, inst_case);

$('#toggle_view .btn').click(function(evt) {
  inst_view = $(evt.target).find('input').attr('id');
  // //!! hack , call a method to remove
  load_clust(inst_view, inst_case);
});

$('#toggle_cases .btn').click(function(evt) {
  inst_case = $(evt.target).find('input').attr('id');
  d3.select('#main_svg').remove();
  load_clust(inst_view, inst_case);
});

