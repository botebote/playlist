// Generated by CoffeeScript 1.6.2
(function() {
  define(['Underscore', 'Backpack', 'text!template/SongItemView.html'], function(_, Backpack, viewTemplate) {
    return Backpack.View.extend({
      template: _.template(viewTemplate),
      events: {
        'click .song-item-view': 'onSongItemClicked',
        'click .add-button': 'onAddButtonClicked'
      },
      render: function() {
        var attrs;

        attrs = this.model.attributes;
        this.$el.html(this.template(attrs));
        return this;
      },
      onSongItemClicked: function() {
        var model;

        model = this.model.clone();
        Backbone.trigger('PLAYLIST_ITEM_INSERT', model);
        Backbone.trigger('PLAYER_PLAY', model);
        Backbone.trigger('SHOW_NOW_PLAYING_VIEW');
        this.$el.addClass('playlist-added');
      },
      onAddButtonClicked: function(e) {
        Backbone.trigger('PLAYLIST_ITEM_ADD', this.model.clone());
        this.$el.addClass('playlist-added');
        e.stopPropagation();
      }
    });
  });

}).call(this);
