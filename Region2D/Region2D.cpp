/*
	Mark Odell CS 116A Region2D assignment
	Tries to create the basic data structure for
	basic two dimensional regions. It does not draw or
	do any sort of graphic image besides printing out
	points and meters. Includes intersection and union
	operations.
*/
#include <iostream>
#include "Region2D.h"

/* ----- Point2D ----- */
Point2D::Point2D () {
	this->x = 0;
	this->y = 0;
};

Point2D::Point2D (int newX, int newY) {
	this->x = newX;
	this->y = newY;
};

// Point2D::Setters & Getters
int Point2D::getX() {
	return x;
};

int Point2D::getY() {
	return y;
};

void Point2D::setX(int newX) {
	this->x = newX;
};

void Point2D::setY(int newY) {
	this->y = newY;
};
// END::Setters & Getters
std::ostream& operator<<(std::ostream& ostr, const Point2D& point) {
    ostr << "( ";
    ostr << point.x << ", " << point.y;
    ostr  << " )";
    return ostr;
};
/* -- End of Point2D -- */

/* ----- Region2D ----- */
Region2D::Region2D() {
	this->width = 0;
	this->height = 0;
	isEmpty = true;
};

Region2D::Region2D(Point2D pt, int newW, int newH) {
	this->min = pt;
	this->width = newW;
	this->height = newH;
	this->max = Point2D(pt.getX() + newW, pt.getY() + newH);
	setIsEmpty();
};

Region2D::Region2D(Point2D pt1, Point2D pt2) {
	if(pt1.getX() < pt2.getX()) {
		this->min = pt1;
		this->max = pt2;
		this->width = pt2.getX() - pt1.getX();
		this->height = pt2.getY() - pt1.getY();
	} else {
		this->min = pt2;
		this->max = pt1;
		this->width = pt1.getX() - pt2.getX();
		this->height = pt1.getY() - pt2.getY();
	}
	setIsEmpty();
};

// Region2D::Setters & Getters
int Region2D::getWidth() {
	return width;
};

int Region2D::getHeight() {
	return height;
};

Point2D Region2D::getMin() {
	return min;
};

Point2D Region2D::getMax() {
	return max;
};
// END::Setters & Getters
Region2D Region2D::unionWith(Region2D a) {
	
	// Find max width and height out of regions
	int lowX = (min.getX() < a.min.getX()) ? min.getX() : a.min.getX();
	int highX = (max.getX() > a.max.getX()) ? max.getX() : a.max.getX(); 
	int lowY = (min.getY() > a.min.getY()) ? min.getY() : a.min.getY();
	int highY = (max.getY() < a.max.getY()) ? max.getY() : a.max.getY();

	return Region2D(Point2D(lowX, lowY), Point2D(highX, highY));
};

Region2D Region2D::intersecWith(Region2D a) {
	if(isEmpty || a.isEmpty)
		return Region2D();

	// Find max width and height out of regions	
	int tlowX = min.getX();
	int thighX = max.getX();
	int tlowY = min.getY();
	int thighY = max.getY();

	int alowX = a.min.getX();
	int ahighX = a.max.getX();
	int alowY = a.min.getY();
	int ahighY = a.max.getY();

	int lowX = (tlowX > alowX) ? tlowX : alowX;
	int highX = (thighX < ahighX) ? thighX : ahighX; 
	int lowY = (tlowY > alowY) ? tlowY : alowY;
	int highY = (thighY < ahighY) ? thighY : ahighY;

	return Region2D(Point2D(lowX, lowY), Point2D(highX, highY));
};

void Region2D::setIsEmpty() {
	if(width == 0 && height == 0){
		isEmpty = true;
	}
}
std::ostream& operator<<(std::ostream& ostr, const Region2D& region){
	if(region.width == 0 && region.height == 0)
		ostr << "(X)";
	else
		ostr << region.min << region.max << " w:" << region.width << " h:" << region.height;
	return ostr;
};
/* - End of Region2D -- */