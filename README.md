# Texture Generator
Create beautiful textures with this small **Texture Generator**. Powered by AngularJS and FabricJS, the software generates unique textures by spreading multiple overlapping objects on a canvas. Each object is randomly generated and differs in size and shape from the other.

Source: https://github.com/ottoiovanici/texture_generator  
Demo: http://plnkr.co/edit/WqwreDjSZhb2XyAa0DsI?p=preview  
Blog Article: http://iovanici.com/beautifully-colored-textures-with-texture-generator/ 

## Description:
Texture generator is a fast and easy tool to create random and beautiful textures. I used it in a personal project [KidStory](http://kidstory.iovanici.com), where I had to replace the colors with something that will beautify the drawings made by children on their tablets and be unique every time.

## Usage:
1. Input the desired number of objects in the textbox (default 4000 random objects)
2. Press **Generate Objects** button to create the desired texture
3. Tweak the Red, Green and Blue color channels to obtain the desired results
4. Press **Clear Canvas** button to erase current texture

## How does it work?

* For every color channel, the software takes a random value between **Start** and **End** value. This selection is going to narrow or broaden the color range values, depending on your selection;
* **Direction Sensitivity** gives a gradient touch to the texture (currently top to bottom); independently selectable for every color; 
  * The *order* variable can be manually changed from the code for different results
* **AntiSmooth** variables can be used to randomly alter the uniformity of the colored process;
  * if **AntiSmooth Intensity** is low, the effect can be barely observed;
  * if **AntiSmooth Frequency** is low, the effect there will be fewer objects containing this effect;

## Behind the scenes
* Objects have a default opacity: `opacity = Math.random() * 0.4`
* Random in range is extracted uniformly with:  
`Math.floor(Math.random() * (max - min + 1)) + min;`
* The software is computation intensive so, **Generate Objects** button press action is *throttled* ([Lodash library](https://lodash.com/docs/4.17.4)) to 2000 ms (2s), to prevent browser/CPU overloading. ==Mobile users can experience poor performance.==
* MAX number of objects is 5000 (performance reasons). If the number of objects exceeds 5000 the canvas automatically clears itself before generating new objects.

## Not implemented (further ideas)  
This is only a quick and dirty version. There are lots of things to improve and to be added.

* Configurable texture resolution;
* Map object opacity on the control interface; 
  * Currently implemented but needs manual adjustment in the code;
* Map object size and shape selection on the control interface;
  * Currently implemented but needs manual adjustment in the code (Rectangles, Circles and Ellipses are possible);
* Map object rotation on the interface;
  * Currently implemented (*angle* param.) but needs manual adjustment in the code
* Map object opacity on the interface;
  * Currently implemented (*opacity* param.) but needs manual adjustment in the code;
* Export to JSON and Save functionality;
* Import from existing JSON;
* Improve the way random function is used for better performance;
* Many, many more...

## Everybody loves images

![Uniform Red Texture](http://iovanici.com/content/images/2017/02/uniform_red_texture.png)
![Direction Sensitive Gradient Red Texture](http://iovanici.com/content/images/2017/02/direction_sensitivity_gradient_red_texture.png)
![AntiSmooth-Red Texture](http://iovanici.com/content/images/2017/02/antismooth_effect_red_texture.png)
![Red Green-Sensitivity](http://iovanici.com/content/images/2017/02/red_green_sensitivity.png)
![Red-AntiSmooth Green-Sensitivity](http://iovanici.com/content/images/2017/02/red_antismooth_green_sensitivity.png)
![Red-Sensitivity Green-Sensitivity](http://iovanici.com/content/images/2017/02/red_sensitivity_green_sensitivity.png)
![Red-Max Green-Full-Range](http://iovanici.com/content/images/2017/02/red_max_green_full_range.png)
![Red_Green_Blue_Full_Range](http://iovanici.com/content/images/2017/02/red_green_blue_full_range.png)

**Implemented with:** [FabricJS](http://fabricjs.com/), [AngularJS](https://angularjs.org/), [Bootstrap 4-alpha](https://https://getbootstrap.com/)
