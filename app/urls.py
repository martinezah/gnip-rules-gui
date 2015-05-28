from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^/?$', 'app.views.index'),
    url(r'^ruleset/(?P<_ruleset>.+)/rule?$', 'app.views.rule'),
    url(r'^ruleset/(?P<_ruleset>.+)/?$', 'app.views.ruleset'),
)
