import json

from django.http import HttpResponse
from django.shortcuts import render, redirect

import gnip_rules
import settings

def index(request):
    response = {
        "rulesets": settings.GNIP['streams'],
    }
    return render(request, 'app/index.html', response)

def ruleset(request, _ruleset):
    response = {
        "ruleset": _ruleset,
    }

    api_url = settings.GNIP['api'].format(ruleset=_ruleset)
    gnipRules = gnip_rules.GnipRules(settings.GNIP['username'], settings.GNIP['password'], api_url)
    gnipRules.listGnipRules()
    response['rules'] = reversed(gnipRules.getRules()['rules'])

    _format = request.GET.get('_f', '')
    if _format == 'json':
        return HttpResponse(json.dumps(response), 'application/json')
    return render(request, 'app/ruleset.html', response)

def rule(request, _ruleset):
    response = {}
    api_url = settings.GNIP['api'].format(ruleset=_ruleset)
    gnipRules = gnip_rules.GnipRules(settings.GNIP['username'], settings.GNIP['password'], api_url)
    _action = request.POST.get('action')
    _tag = request.POST.get('tag')
    _value = request.POST.get('value')
    if _action == 'add':
        gnipRules.appendLocalRule(_value, tag=_tag)
        gnipRules.createGnipRules()
        response["status"] = "ok" 
    if _action == 'delete':
        gnipRules.appendLocalRule(_value, tag=_tag)
        gnipRules.deleteGnipRules()
        response["status"] = "ok" 
    return HttpResponse(json.dumps(response), 'application/json')
    

