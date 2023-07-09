#!/bin/bash

# JavaScript linting
JS_NBERR=$(grep -e "^ERROR" lintes_report_js.txt | wc -l)
JS_NBWARN=$(grep -e "^WARNING" lintes_report_js.txt | wc -l)
JS_COLOR="green"
if [[ $JS_NBERR > 0 ]]
then 
  JS_COLOR="red"
  else if [[ $JS_NBWARN > 0 ]]
  then 
    JS_COLOR="orange"
  fi
fi
anybadge -o -l "LINT-JS" -v "$JS_NBERR $JS_NBWARN" -c "$JS_COLOR" -f "badge_js_lint.svg"

# HTML linting
HTML_NBERR=$(grep -e "^Error" lintes_report_html.txt | wc -l)
HTML_NBWARN=$(grep -e "^WARN" lintes_report_html.txt | wc -l)
HTML_COLOR="green"
if [[ $HTML_NBERR > 0 ]]
then 
  HTML_COLOR="red"
  else if [[ $HTML_NBWARN > 0 ]]
  then 
    HTML_COLOR="orange"
  fi
fi
anybadge -o -l "LINT-HTML" -v "$HTML_NBERR $HTML_NBWARN" -c "$HTML_COLOR" -f "badge_html_lint.svg"

# CSS linting
CSS_NBERR=$(grep -e "^Error" lintes_report_css.txt | wc -l)
CSS_NBWARN=$(grep -e "^WARN:" lintes_report_css.txt | wc -l)
CSS_COLOR="green"
if [[ $CSS_NBERR > 0 ]]
then 
  CSS_COLOR="red"
  else if [[ $CSS_NBWARN > 0 ]]
  then 
    CSS_COLOR="orange"
  fi
fi
anybadge -o -l "LINT-CSS" -v "$CSS_NBERR $CSS_NBWARN" -c "$CSS_COLOR" -f "badge_css_lint.svg"
