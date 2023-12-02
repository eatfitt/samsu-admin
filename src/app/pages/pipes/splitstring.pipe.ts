 // Angular
 import { Pipe, PipeTransform } from '@angular/core';
 import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
 
 /**
  * Sanitize HTML
  */
 @Pipe({
   name: 'splitstring'
 })
 export class SplitStringPipe implements PipeTransform {
   /**
    * Pipe Constructor
    *
    * @param _sanitizer: DomSanitezer
    */
   // tslint:disable-next-line
   constructor() {
   }
 
   /**
    * Transform
    *
    * @param value: string
    * @param type: string
    */
   transform(value: string, type: string): string[] {
     return value.split(type);
   }
 }