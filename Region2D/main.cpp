/*
	Mark Odell CS 116A Region2D assignment
	Tries to create the basic data structure for
	basic two dimensional regions. This main file
	includes some tests. This program is not fully
	tested.
*/
#include <iostream>
#include "Region2D.h"

using namespace std;

void ContructorTests();
void UnionTests();
void IntersectionTests();

int main (void) {
	
	/* Various inputs: (at least the following)
		default = no inputs
		4 ints: xmin, xmax, ymin, ymax
		Two points */
	/* Handle the case of an empty Region2D */
	ContructorTests();
	cout << "--Contructor Tests--" << endl;
	UnionTests();
	cout << "--Intersection Tests--" << endl;
	IntersectionTests();
	return 0;
};

void IntersectionTests() {
	Region2D reg1(Point2D(2,3), Point2D(1,2));
	Region2D reg2(Point2D(1,4), Point2D(0,0));
	cout << "Testing same Regions:" << endl;
	cout << reg1 << endl << "&&" << endl << reg2 << endl;
	reg2 = reg1.intersecWith(reg1);
	cout << reg2 << endl;

	Region2D reg3;
	cout << "Testing with Empty Regions:" << endl;
	cout << reg1 << endl << "&&" << endl << reg3 << endl;
	reg2 = reg1.intersecWith(reg1);
	cout << reg2 << endl;
}

void UnionTests() {
	Region2D reg1(Point2D(2,3), Point2D(1,2));
	Region2D reg2(Point2D(1,4), Point2D(0,0));
	cout << "Testing same Regions:" << endl;
	cout << reg1 << endl << "&&" << endl << reg2 << endl;
	reg2 = reg1.unionWith(reg1);
	cout << reg2 << endl;

	Region2D reg3;
	cout << "Testing with Empty Regions:" << endl;
	cout << reg1 << endl << "&&" << endl << reg3 << endl;
	reg2 = reg1.unionWith(reg1);
	cout << reg2 << endl;
}

void ContructorTests() {
	Point2D aPt;
	Region2D aReg;

	cout << "Default Point2D Constructor test:" << endl;
	cout << aPt << endl;
	cout << "Secondary Point2D constructor tests:" << endl;
	Point2D otherPt (4,5);
    cout << otherPt << endl;
    Point2D otherPt2 (-50,0);
    cout << otherPt2 << endl;
    Point2D otherPt3 (0,-34);
    cout << otherPt3 << endl;
    Point2D otherPt4 (-1,-2);
    cout << otherPt4 << endl;
    Point2D otherPt5 (0,0);
    cout << otherPt5 << endl;

    cout << "Default Region2D constructor:" << endl;
    cout << aReg << endl;
    cout << "Secondary Region2D constructors:" << endl;
    Region2D otherReg (otherPt, 2, 4);
    cout << otherReg << endl;
    Region2D otherReg2 (otherPt, 0, 4);
    cout << otherReg2 << endl;
    Region2D otherReg3 (otherPt, -1, 4);
    cout << otherReg3 << endl;
    Region2D otherReg4 (otherPt, 2, -4);
    cout << otherReg4 << endl;
    Region2D otherReg5 (otherPt, -2, -4);
    cout << otherReg5 << endl;

    Region2D otherReg6 (otherPt, otherPt5);
    cout << otherReg6 << endl;
    Region2D otherReg7 (Point2D(4,4), Point2D(5,5));
    cout << otherReg7 << endl;
};