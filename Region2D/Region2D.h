/* A location on a given Dimension */
class Point2D {
public:
	Point2D();
	Point2D(int newX, int newY);
	int getX();
	int getY();
	void setX(int newX);
	void setY(int newY);

	friend std::ostream& operator<<(std::ostream& ostr, const Point2D& point);
private:
	int x, y;
};
/* Write a data class for Region2D, as we discussed in class.
	Can define in terms of type int
	It can be a struct or a class */
class Region2D
{
public:
	/* Write two methods
		Union of 2 Region2D's returns a new Region2D
		Intersection of 2 Regions2D's return a new Region2D
		Optional define as overloaded operators || and && */
	Region2D unionWith(Region2D a);
	Region2D intersecWith(Region2D a);
	int getWidth();
	int getHeight();
	Point2D getMin();
	Point2D getMax();

	/* Write constructors or functions from creating new Regions2D s */
	Region2D ();
	Region2D (int newW, int newH);
	Region2D (Point2D pt, int newW, int newH);
	Region2D (Point2D pt1, Point2D pt2);
	friend std::ostream& operator<<(std::ostream& ostr, const Region2D& region);
private:
	int width;
	int height;
	Point2D min;
	Point2D max;
	bool isEmpty;
	void setIsEmpty();
};
