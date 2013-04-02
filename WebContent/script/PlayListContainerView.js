// Generated by CoffeeScript 1.4.0
(function() {

  define(['jQuery', 'Underscore', 'Backpack', 'CurrentModel', 'backpack/components/ListView', 'PlayItemView', 'backpack/plugins/Sortable', 'text!template/PlayListContainerView.html'], function($, _, Backpack, CurrentModel, ListView, PlayItemView, Sortable, viewTemplate) {
    return Backpack.View.extend({
      template: _.template(viewTemplate),
      events: {
        'click .songListBtn': 'close'
      },
      initialize: function(options) {
        var collection, view;
        Backpack.View.prototype.initialize.apply(this, arguments);
        this.render();
        collection = new Backpack.Collection(null, {
          model: Backpack.Model,
          plugins: [CurrentModel],
          subscribers: {
            SONG_STARTED: 'setCurrentModel',
            SONG_FINISHED: 'onSongFinished',
            PLAYLIST_ITEM_ADD: 'add',
            PLAYLIST_ITEM_INSERT: 'insertAfterCurrent'
          },
          publishers: {
            setCurrentIndex: 'PLAYLIST_INDEX_UPDATED'
          },
          onSongFinished: function() {
            var model;
            model = this.next();
            if (model) {
              player.play(model);
            }
          }
        });
        view = this.listView = new ListView({
          collection: collection,
          el: '#playListView',
          itemClass: PlayItemView,
          plugins: [Sortable],
          subscribers: {
            PLAYLIST_INDEX_UPDATED: 'onCurrentIndexUpdated'
          },
          onCurrentIndexUpdated: function(index) {
            if (this._nowPlayingView) {
              this._nowPlayingView.$el.removeClass('now-playing');
            }
            if (index !== -1) {
              view = this._nowPlayingView = this.getChild(index);
              view.$el.addClass('now-playing');
            }
          }
        });
        view.render();
      },
      render: function() {
        this.$el.html(this.template());
        this.$el.dialog({
          autoOpen: false,
          width: $(window).width(),
          height: $(window).height()
        });
        return this;
      },
      open: function() {
        this.$el.dialog('open');
      },
      close: function() {
        this.$el.dialog('close');
      }
    });
  });

}).call(this);
