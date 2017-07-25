// This file is a part of quicksave project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@quicksave.io>.

function $DOM(elementName, elementAttributes={})
{
    let dom = document.createElement(elementName);
    for(let attributeIndex in elementAttributes)
    {
        dom.setAttribute(attributeIndex, elementAttributes[attributeIndex]);
    }
    return dom;
}

function $$(parentNode)
{
    for(let i = 1; i < arguments.length; i++)
    {
        parentNode.appendChild(arguments[i]);
    }
    return parentNode;
}

function $$$(parentNode, innerHTML)
{
    parentNode.innerHTML = innerHTML;
    return parentNode;
}

function $BIND(dom, eventName, callback)
{
    dom.addEventListener(eventName, callback);
    return dom;
}

function $SWAP(oldNode, newNode)
{
    oldNode.parentNode.replaceChild(newNode, oldNode);
}

function $DEEPSWAP(lhsNode, rhsNode)
{
    let deepSwapPivot = div();
    $SWAP(lhsNode, deepSwapPivot);
    $SWAP(rhsNode, lhsNode);
    $SWAP(deepSwapPivot, rhsNode);
}

function div(attrs)
{
    return $DOM('div', attrs);
}

function input(attrs)
{
    return $DOM('input', attrs);
}

function i(attrs)
{
    return $DOM('i', attrs);
}

function button(attrs)
{
    return $DOM('button', attrs);
}

function form(attrs)
{
    return $DOM('form', attrs);
}

function label(attrs)
{
    return $DOM('label', attrs);
}

function pre(attrs)
{
    return $DOM('pre', attrs);
}

function br(attrs)
{
    return $DOM('br', attrs);
}

function a(attrs)
{
    return $DOM('a', attrs);
}

function p(attrs)
{
    return $DOM('p', attrs);
}

function img(attrs)
{
    return $DOM('img', attrs)
}

function source(attrs)
{
    return $DOM('source', attrs);
}

function embed(attrs)
{
    return $DOM('embed', attrs);
}

function video(attrs)
{
    return $DOM('video', attrs);
}

function span(attrs)
{
    return $DOM('span', attrs);
}

function textarea(attrs)
{
    return $DOM('textarea', attrs);
}

function select(attrs)
{
    return $DOM('select', attrs);
}

function option(attrs)
{
    return $DOM('option', attrs);
}

function table(attrs)
{
    return $DOM('table', attrs);
}

function tr(attrs)
{
    return $DOM('tr', attrs);
}

function td(attrs)
{
    return $DOM('td', attrs);
}

