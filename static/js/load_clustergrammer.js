
var names_array = [
  'lvo_gene-term_edges',
  'cases_gene-term_edges',
  'lvo_enriched_ppi',
  'cases_enriched_ppi',
  'lvo_filtered_ppi',
  'cases_filtered_ppi',
  'ctd_filtered_ppi',
  'htx_filtered_ppi',
  'ctrl_filtered_ppi'
];

var title_dict = {
  'cases_enriched_ppi':'Cases Enriched PPI',
  'cases_filtered_ppi':'Cases Filtered PPI',
  'ctd_filtered_ppi':'CTD Filtered PPI',
  'ctrl_filtered_ppi':'Control Filtered PPI',
  'htx_filtered_ppi':'HTX Filtered PPI',
  'lvo_enriched_ppi':'LVO Enriched PPI',
  'lvo_filtered_ppi':'LVO Filtered PPI',
  'cases_gene-term_edges':'Cases Gene-Term Associations' ,
  'lvo_gene-term_edges':'LVO Gene-Term Associations'
}

var desc_dict = {
  'cases_enriched_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in all cases associated with enriched terms, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'cases_filtered_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in all cases, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'ctd_filtered_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in CTD patients, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'ctrl_filtered_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in all controls, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'htx_filtered_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in HTX patients, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'lvo_enriched_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in LVO patients associated with enriched terms, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'lvo_filtered_ppi':'Protein-protein interaction sub-network with seed genes defined as the filtered mutated genes in LVO patients, and intermediate genes defined as genes with interactions significantly overlapping with the seed genes.',
  'cases_gene-term_edges':'Bipartite graph connecting filtered mutated genes in all cases to significantly enriched GO biological processes and GO cellular components.' ,
  'lvo_gene-term_edges':'Bipartite graph connecting filtered mutated genes in LVO patients to significantly enriched GO biological processes and GO cellular components.'
}

var clust_sections = d3.select('#all_viz_container')
  .selectAll('div')
  .data(names_array)
  .enter()
  .append('div')
  .classed('clust_section',true);

clust_sections
  .append('h2')
  .html(function(d){
    var inst_title = 'Figure '+ String(names_array.indexOf(d)+1) +': '+ title_dict[d]
    return inst_title;
  });

clust_sections
  .append('div')
  .classed('row',true)
  .classed('clustergrammer_row', true)
  .style('width', '1100px')
  .style('height', '700px')
  .style('margin-bottom', '10px')
  .style('margin-left', '10px')
  .append('div')
  .attr('id',function(d){
    var inst_num = names_array.indexOf(d)+1;
    return 'container-id-'+String(inst_num);
  })
  .append('h2')
  .classed('wait_message',true)
  .html('Please wait');

clust_sections
  .classed('clustergrammer_container',true)
  .append('div')
  .classed('row',true)
  .classed('clust_description',true)
  .style('margin-bottom','50px')
  .style('margin-left','20px')
  .style('width','1050px')
  .style('display','none')
  .append('p')
  .style('font-size','15px')
  .html(function(d){
    return desc_dict[d];
  });

  var outer_margins = {
      'top':2,
      'bottom':30,
      'left':5,
      'right':2
    };

  var viz_size = {
      'width':850,
      'height':700
    };


_.each(names_array, function(clust_name){

  inst_network = '/static/networks/'+clust_name+'.json';

  d3.json(inst_network, function(network_data){

    // define arguments object
    var arguments_obj = {
      'outer_margins': outer_margins,
      'show_label_tooltips':true,
      'show_tile_tooltips':true,
      'size':viz_size,
      'about':'Zoom, scroll, and click buttons to interact with the visualization.',
      'row_search_placeholder':'Gene'
    };

    arguments_obj.network_data = network_data;

    var tmp_num = names_array.indexOf(clust_name)+1;


    arguments_obj.root = '#container-id-'+String(tmp_num);
    console.log(arguments_obj.root)

    cgm = Clustergrammer(arguments_obj);

    d3.selectAll(cgm.params.root+' .row_cat_super')
    .remove();

    // chd specific
    /////////////////
    d3.selectAll(cgm.params.root+' .key_cat_row').remove();

    d3.selectAll(' .wait_message').remove();

    d3.selectAll('.clust_description')
      .style('display','block');

    d3.selectAll('.btn')
      .filter(function(){
        return d3.select(this).attr('name') == 'rankvar'
      }).remove();

    d3.selectAll('.expand_button')
      .remove();

    d3.selectAll('.icons_section')
      .remove();

    d3.select('.key_cat_col')
      .style('max-height','200px');
  })

});

