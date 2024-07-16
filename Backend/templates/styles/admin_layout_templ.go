// Code generated by templ - DO NOT EDIT.

// templ: version: v0.2.731
package styles

//lint:file-ignore SA4006 This context is only used if a nested component is present.

import "github.com/a-h/templ"
import templruntime "github.com/a-h/templ/runtime"

func NavStyle() templ.CSSClass {
	templ_7745c5c3_CSSBuilder := templruntime.GetBuilder()
	templ_7745c5c3_CSSBuilder.WriteString(`display:flex;`)
	templ_7745c5c3_CSSBuilder.WriteString(`justify-content:space-between;`)
	templ_7745c5c3_CSSBuilder.WriteString(`padding-inline:2rem;`)
	templ_7745c5c3_CSSID := templ.CSSID(`NavStyle`, templ_7745c5c3_CSSBuilder.String())
	return templ.ComponentCSSClass{
		ID:    templ_7745c5c3_CSSID,
		Class: templ.SafeCSS(`.` + templ_7745c5c3_CSSID + `{` + templ_7745c5c3_CSSBuilder.String() + `}`),
	}
}

func NavListStyle() templ.CSSClass {
	templ_7745c5c3_CSSBuilder := templruntime.GetBuilder()
	templ_7745c5c3_CSSBuilder.WriteString(`display:flex;`)
	templ_7745c5c3_CSSBuilder.WriteString(`gap:1rem;`)
	templ_7745c5c3_CSSBuilder.WriteString(`list-style:none;`)
	templ_7745c5c3_CSSBuilder.WriteString(`padding:0;`)
	templ_7745c5c3_CSSBuilder.WriteString(`margin:0;`)
	templ_7745c5c3_CSSID := templ.CSSID(`NavListStyle`, templ_7745c5c3_CSSBuilder.String())
	return templ.ComponentCSSClass{
		ID:    templ_7745c5c3_CSSID,
		Class: templ.SafeCSS(`.` + templ_7745c5c3_CSSID + `{` + templ_7745c5c3_CSSBuilder.String() + `}`),
	}
}

func AdminBodyStyle() templ.CSSClass {
	templ_7745c5c3_CSSBuilder := templruntime.GetBuilder()
	templ_7745c5c3_CSSBuilder.WriteString(`display:grid;`)
	templ_7745c5c3_CSSBuilder.WriteString(`grid-template-rows:auto 1fr auto;`)
	templ_7745c5c3_CSSBuilder.WriteString(`min-height:100svh;`)
	templ_7745c5c3_CSSBuilder.WriteString(`margin:0;`)
	templ_7745c5c3_CSSID := templ.CSSID(`AdminBodyStyle`, templ_7745c5c3_CSSBuilder.String())
	return templ.ComponentCSSClass{
		ID:    templ_7745c5c3_CSSID,
		Class: templ.SafeCSS(`.` + templ_7745c5c3_CSSID + `{` + templ_7745c5c3_CSSBuilder.String() + `}`),
	}
}
